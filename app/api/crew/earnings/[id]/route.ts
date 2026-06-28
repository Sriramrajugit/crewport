import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const { id } = await params;
            const body = await request.json();
            const { cash_drawn, home_allowance, other_deduction, travel_wages, joining_expenses, hra } = body;

            if (!id) {
                return NextResponse.json(
                    { error: 'Missing earnings ID' },
                    { status: 400 }
                );
            }

            // Validate numeric fields
            const validateNumericField = (value: any, fieldName: string) => {
                if (value === undefined || value === null || value === '') return null;
                
                const num = parseFloat(value);
                if (isNaN(num)) {
                    return `${fieldName} must be a valid number`;
                }
                if (num < 0) {
                    return `${fieldName} cannot be negative`;
                }
                
                // Check decimal places (max 2)
                if (!String(num).match(/^\d+(\.\d{0,2})?$/)) {
                    return `${fieldName} can have maximum 2 decimal places`;
                }
                
                return null;
            };

            const errors: string[] = [];
            if (cash_drawn !== undefined) {
                const error = validateNumericField(cash_drawn, 'Cash Drawn');
                if (error) errors.push(error);
            }
            
            if (home_allowance !== undefined) {
                const error = validateNumericField(home_allowance, 'Home Allowance');
                if (error) errors.push(error);
            }
            if (other_deduction !== undefined) {
                const error = validateNumericField(other_deduction, 'Other Deduction');
                if (error) errors.push(error);
            }

            if (travel_wages !== undefined) {
                const error = validateNumericField(travel_wages, 'Travel Wages');
                if (error) errors.push(error);
            }

            if (joining_expenses !== undefined) {
                const error = validateNumericField(joining_expenses, 'Joining Expenses');
                if (error) errors.push(error);
            }

            if (hra !== undefined) {
                const error = validateNumericField(hra, 'HRA');
                if (error) errors.push(error);
            }

            if (errors.length > 0) {
                return NextResponse.json(
                    { error: 'Validation failed', details: errors.join('; ') },
                    { status: 400 }
                );
            }

            // Verify the earnings record exists and belongs to a crew member in this vessel
            const earning = await prisma.crewEarnings.findUnique({
                where: { id: parseInt(id) },
                include: { crew_members: { select: { id: true, name: true, vessel_id: true, sign_off_date: true } } }
            });

            if (!earning || earning.crew_members?.vessel_id !== vesselId) {
                return NextResponse.json(
                    { error: 'Earnings record not found or access denied' },
                    { status: 403 }
                );
            }

            // Check if crew member has exited - prevent updates after exit date
            if (earning.crew_members?.sign_off_date) {
                const signOffDate = new Date(earning.crew_members.sign_off_date);
                const monthYear = new Date(earning.year, earning.month - 1, 1);
                
                // If sign_off_date is before the first day of the earnings month, prevent update
                if (signOffDate < monthYear) {
                    return NextResponse.json(
                        { 
                            error: `Cannot update earnings: Crew member ${earning.crew_members.name} has already exited on ${signOffDate.toDateString()}`,
                            details: `No deductions or earnings can be updated after the exit date.`
                        },
                        { status: 400 }
                    );
                }
            }

            const updated = await prisma.crewEarnings.update({
                where: { id: parseInt(id) },
                data: {
                    cash_drawn: cash_drawn !== undefined ? parseFloat(cash_drawn) : undefined,
                    home_allowance: home_allowance !== undefined ? parseFloat(home_allowance) : undefined,
                    other_deduction: other_deduction !== undefined ? parseFloat(other_deduction) : undefined,
                    travel_wages: travel_wages !== undefined && travel_wages !== '' ? parseFloat(travel_wages) : undefined,
                    joining_expenses: joining_expenses !== undefined && joining_expenses !== '' ? parseFloat(joining_expenses) : undefined,
                    hra: hra !== undefined && hra !== '' ? parseFloat(hra) : undefined,
                    updated_at: new Date(),
                },
            });

            return NextResponse.json(updated);
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to update crew earnings', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const { id } = await params;

            if (!id) {
                return NextResponse.json(
                    { error: 'Missing earnings ID' },
                    { status: 400 }
                );
            }

            const earning = await prisma.crewEarnings.findUnique({
                where: { id: parseInt(id) },
                include: {
                    crew_members: {
                        select: {
                            id: true,
                            name: true,
                            rank: true,
                            vessel_id: true,
                        }
                    }
                }
            });

            if (!earning || earning.crew_members?.vessel_id !== vesselId) {
                return NextResponse.json(
                    { error: 'Earnings record not found or access denied' },
                    { status: 403 }
                );
            }

            return NextResponse.json(earning);
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to fetch crew earnings', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}
