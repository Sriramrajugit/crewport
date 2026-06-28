import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess, getVesselIdFromRequest } from '@/lib/accessControl';

export async function GET(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const { searchParams } = new URL(request.url);
            const month = searchParams.get('month');
            const year = searchParams.get('year');

            if (!month || !year) {
                return NextResponse.json(
                    { error: 'Missing required parameters: month, year' },
                    { status: 400 }
                );
            }

            const monthNum = parseInt(month);
            const yearNum = parseInt(year);

            // Calculate first and last day of the given month/year
            const firstDayOfMonth = new Date(yearNum, monthNum - 1, 1);
            const lastDayOfMonth = new Date(yearNum, monthNum, 0);
            
            // Ensure we're comparing dates at midnight UTC for consistency
            firstDayOfMonth.setUTCHours(0, 0, 0, 0);
            lastDayOfMonth.setUTCHours(23, 59, 59, 999);

            const earnings = await prisma.crewEarnings.findMany({
                where: {
                    crew_members: {
                        vessel_id: vesselId,
                        deleted_at: null,
                        // Crew member must have signed on on or before the last day of the month
                        sign_on_date: {
                            lte: lastDayOfMonth,
                        },
                        // Crew member must not have signed off before the first day of the month
                        // OR sign_off_date must be null (still active)
                        OR: [
                            { sign_off_date: null },
                            { sign_off_date: { gte: firstDayOfMonth } },
                        ]
                    },
                    month: monthNum,
                    year: yearNum,
                },
                include: {
                    crew_members: {
                        select: {
                            id: true,
                            name: true,
                            rank: true,
                            vessel_id: true,
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            return NextResponse.json(earnings);
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to fetch crew earnings', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}

export async function POST(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const body = await request.json();
            const { crew_member_id, month, year, cash_drawn, home_allowance, other_deduction } = body;

            // Validation
            if (!crew_member_id || !month || !year) {
                return NextResponse.json(
                    { error: 'Missing required fields: crew_member_id, month, year' },
                    { status: 400 }
                );
            }

            // Get crew member and verify it belongs to this vessel
            const crewMember = await prisma.crewMember.findUnique({
                where: { id: parseInt(crew_member_id) }
            });

            if (!crewMember || crewMember.vessel_id !== vesselId) {
                return NextResponse.json(
                    { error: 'Crew member not found or does not belong to this vessel' },
                    { status: 404 }
                );
            }

            // Check if crew member has exited - prevent entries after exit date
            if (crewMember.sign_off_date) {
                const signOffDate = new Date(crewMember.sign_off_date);
                const monthYear = new Date(parseInt(year), parseInt(month) - 1, 1);
                
                // If sign_off_date is before the first day of the requested month, prevent entry
                if (signOffDate < monthYear) {
                    return NextResponse.json(
                        { 
                            error: `Cannot add earnings: Crew member ${crewMember.name} has already exited on ${signOffDate.toDateString()}`,
                            details: `No deductions or earnings can be added after the exit date.`
                        },
                        { status: 400 }
                    );
                }
            }

            // Validate deduction values
            const validateDeduction = (value: any, fieldName: string) => {
                const num = parseFloat(value);
                if (isNaN(num)) {
                    return `${fieldName} must be a valid number`;
                }
                if (num < 0) {
                    return `${fieldName} cannot be negative`;
                }
                return null;
            };

            const errors = [];
            const cashError = validateDeduction(cash_drawn || 0, 'Cash Drawn');
            if (cashError) errors.push(cashError);
            
            const homeError = validateDeduction(home_allowance || 0, 'Home Allowance');
            if (homeError) errors.push(homeError);
            
            const otherError = validateDeduction(other_deduction || 0, 'Other Deduction');
            if (otherError) errors.push(otherError);

            if (errors.length > 0) {
                return NextResponse.json(
                    { error: 'Validation failed', details: errors.join('; ') },
                    { status: 400 }
                );
            }

            // Check for duplicate entry
            const existingEarning = await prisma.crewEarnings.findUnique({
                where: {
                    crew_member_id_month_year: {
                        crew_member_id: parseInt(crew_member_id),
                        month: parseInt(month),
                        year: parseInt(year)
                    }
                }
            });

            if (existingEarning) {
                return NextResponse.json(
                    { error: 'Earnings record already exists for this crew member in this month/year' },
                    { status: 409 }
                );
            }

            // Calculate brought_forward from previous month's final balance
            let broughtForward = 0;
            let prevMonth = parseInt(month) - 1;
            let prevYear = parseInt(year);

            if (prevMonth === 0) {
                prevMonth = 12;
                prevYear = prevYear - 1;
            }

            if (prevYear > 0) {
                const prevMonthEarning = await prisma.crewEarnings.findUnique({
                    where: {
                        crew_member_id_month_year: {
                            crew_member_id: parseInt(crew_member_id),
                            month: prevMonth,
                            year: prevYear
                        }
                    }
                });

                if (prevMonthEarning) {
                    // Calculate previous month's final balance
                    const prevTotalEarnings = 
                        parseFloat(String(prevMonthEarning.basic_salary || 0)) +
                        parseFloat(String(prevMonthEarning.fixed_overtime || 0)) +
                        parseFloat(String(prevMonthEarning.leave_wages || 0)) +
                        parseFloat(String(prevMonthEarning.other_allowances || 0)) +
                        parseFloat(String(prevMonthEarning.travel_wages || 0)) +
                        parseFloat(String(prevMonthEarning.hra || 0)) +
                        parseFloat(String(prevMonthEarning.joining_expenses || 0)) +
                        parseFloat(String(prevMonthEarning.onboard_allowance_short_manning || 0));

                    const prevTotalDeductions =
                        parseFloat(String(prevMonthEarning.cash_drawn || 0)) +
                        parseFloat(String(prevMonthEarning.home_allowance || 0)) +
                        parseFloat(String(prevMonthEarning.bond_deduction || 0)) +
                        parseFloat(String(prevMonthEarning.other_deduction || 0));

                    broughtForward = Math.round((prevTotalEarnings - prevTotalDeductions + parseFloat(String(prevMonthEarning.brought_forward || 0))) * 100) / 100;
                }
            }

            const earning = await prisma.crewEarnings.create({
                data: {
                    crew_member_id: parseInt(crew_member_id),
                    month: parseInt(month),
                    year: parseInt(year),
                    // Copy salary from crew member
                    basic_salary: crewMember.basic_salary,
                    fixed_overtime: crewMember.fixed_overtime,
                    leave_wages: crewMember.leave_wages,
                    other_allowances: crewMember.other_allowances,
                    travel_wages: crewMember.travel_wages,
                    hra: crewMember.hra,
                    joining_expenses: crewMember.joining_expenses,
                    onboard_allowance_short_manning: crewMember.onboard_allowance_short_manning,
                    // Calculate total earnings: Basic + Fixed OT + Leave Wages + Other Allowance + Travel wages + HRA + Joining Exp + Onboard allowance
                    total_earnings: parseFloat(String(crewMember.basic_salary || 0)) + 
                                    parseFloat(String(crewMember.fixed_overtime || 0)) + 
                                    parseFloat(String(crewMember.leave_wages || 0)) + 
                                    parseFloat(String(crewMember.other_allowances || 0)) + 
                                    parseFloat(String(crewMember.travel_wages || 0)) + 
                                    parseFloat(String(crewMember.hra || 0)) + 
                                    parseFloat(String(crewMember.joining_expenses || 0)) + 
                                    parseFloat(String(crewMember.onboard_allowance_short_manning || 0)),
                    // Deductions
                    cash_drawn: parseFloat(cash_drawn || 0),
                    home_allowance: parseFloat(home_allowance || 0),
                    other_deduction: parseFloat(other_deduction || 0),
                    // Brought forward from previous month's final balance
                    brought_forward: broughtForward,
                }
            });

            return NextResponse.json(earning);
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to create crew earnings', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}
