import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVesselIdFromRequest, withVesselAccess } from '@/lib/accessControl';

export async function GET(request: NextRequest) {
    try {
        console.log('=== Crew API GET called ===');
        const { searchParams } = new URL(request.url);
        
        // Get vesselId from query params or headers
        let vesselId = searchParams.get('vesselId');
        if (!vesselId) {
            const headerVesselId = getVesselIdFromRequest(request);
            vesselId = headerVesselId?.toString() || null;
        }
        
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        console.log('Fetching crew for vesselId:', vesselId, 'month:', month, 'year:', year);

        if (!vesselId) {
            return NextResponse.json(
                { error: 'vesselId is required' },
                { status: 400 }
            );
        }

        console.log('Executing Prisma query...');
        const whereClause: any = {
            deleted_at: null,
            vessel_id: parseInt(vesselId)
        };

        // Apply date filtering if month and year are provided
        if (month && year) {
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);

            // Calculate first and last day of the given month/year
            const firstDayOfMonth = new Date(yearNum, monthNum - 1, 1);
            const lastDayOfMonth = new Date(yearNum, monthNum, 0);
            
            // Ensure we're comparing dates at midnight UTC for consistency
            firstDayOfMonth.setUTCHours(0, 0, 0, 0);
            lastDayOfMonth.setUTCHours(23, 59, 59, 999);

            // Crew member must have signed on on or before the last day of the month
            whereClause.sign_on_date = {
                lte: lastDayOfMonth,
            };

            // Crew member must not have signed off before the first day of the month
            // OR sign_off_date must be null (still active)
            whereClause.OR = [
                { sign_off_date: null },
                { sign_off_date: { gte: firstDayOfMonth } },
            ];
        }

        const crew = await prisma.crewMember.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                rank: true,
                nationality: true,
                passport_number: true,
                vessel_id: true,
                date_of_birth: true,
                sign_on_date: true,
                sign_off_date: true,
                sign_on_port: true,
                sign_off_port: true,
                exit_type: true,
                exit_remarks: true,
                onboarding_status: true,
                crew_status: true,
                basic_salary: true,
                fixed_overtime: true,
                leave_wages: true,
                other_allowances: true,
                travel_wages: true,
                hra: true,
                joining_expenses: true,
                onboard_allowance_short_manning: true,
                total_earnings: true,
                vessels: {
                    select: {
                        id: true,
                        vessel_name: true,
                    }
                },
                crew_earnings: {
                    select: {
                        id: true,
                        crew_member_id: true,
                        basic_salary: true,
                        fixed_overtime: true,
                        leave_wages: true,
                        other_allowances: true,
                        travel_wages: true,
                        hra: true,
                        joining_expenses: true,
                        onboard_allowance_short_manning: true,
                        total_earnings: true,
                        cash_drawn: true,
                        home_allowance: true,
                        bond_deduction: true,
                        other_deduction: true,
                        brought_forward: true,
                    }
                }
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        console.log('Found crew members:', crew.length);
        return NextResponse.json(crew);
    } catch (error) {
        console.error('❌ Error in crew API GET:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error details:', errorMessage);
        return NextResponse.json(
            { 
                error: 'Failed to fetch crew',
                details: errorMessage,
                stack: error instanceof Error ? error.stack : 'No stack trace'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const body = await request.json();

            console.log('Received crew data:', { 
                name: body.name, 
                contact_number: body.contact_number,
                vessel_id: body.vessel_id,
                company_id: body.company_id,
                created_by: body.created_by
            });

            // Basic validation - trim strings to check for whitespace-only values
            const name = body.name?.trim() || '';
            const position = body.position?.trim() || null;

            if (!name || !body.company_id) {
                return NextResponse.json(
                    { error: 'Missing required fields: name, company_id' },
                    { status: 400 }
                );
            }

            // Validate numeric fields
            const companyId = parseInt(body.company_id);

            if (isNaN(companyId)) {
                return NextResponse.json(
                    { error: 'Invalid numeric values for company_id' },
                    { status: 400 }
                );
            }

            // Use vessel ID from request context (validated by middleware)
            // Do not allow user to override vessel_id from body
            const newCrew = await prisma.crewMember.create({
                data: {
                    name: body.name.trim(),
                    vessel_id: vesselId,  // Use validated vessel ID from context
                    company_id: companyId,
                    created_by: userId,   // Use authenticated user ID
                    contact_number: body.contact_number || null,
                    rank: body.rank || null,
                    position: position,
                    nationality: body.nationality || null,
                    sign_on_port: body.sign_on_port || null,
                    sign_on_date: body.sign_on_date ? new Date(body.sign_on_date) : null,
                    sign_off_port: body.sign_off_port || null,
                    sign_off_date: body.sign_off_date ? new Date(body.sign_off_date) : null,
                    passport_number: body.passport_number || null,
                    date_of_birth: body.date_of_birth ? new Date(body.date_of_birth) : null,
                    // Salary fields
                    basic_salary: body.basic_salary ? parseFloat(body.basic_salary) : null,
                    fixed_overtime: body.fixed_overtime ? parseFloat(body.fixed_overtime) : null,
                    leave_wages: body.leave_wages ? parseFloat(body.leave_wages) : null,
                    other_allowances: body.other_allowances ? parseFloat(body.other_allowances) : null,
                    travel_wages: body.travel_wages ? parseFloat(body.travel_wages) : null,
                    hra: body.hra ? parseFloat(body.hra) : null,
                    joining_expenses: body.joining_expenses ? parseFloat(body.joining_expenses) : null,
                    onboard_allowance_short_manning: body.onboard_allowance_short_manning ? parseFloat(body.onboard_allowance_short_manning) : null,
                    total_earnings: body.total_earnings ? parseFloat(body.total_earnings) : null,
                },
            });

            return NextResponse.json(newCrew, { status: 201 });
        } catch (error) {
            console.error('Error creating crew:', error);
            return NextResponse.json(
                { error: 'Failed to create crew member', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}
