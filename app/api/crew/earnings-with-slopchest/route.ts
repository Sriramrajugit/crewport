import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

// Get crew earnings with slopchest deductions included
export async function GET(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const { searchParams } = new URL(request.url);
            const month = searchParams.get('month');
            const year = searchParams.get('year');

            if (!month || !year) {
                return NextResponse.json(
                    { error: 'month and year are required' },
                    { status: 400 }
                );
            }

            const monthInt = parseInt(month);
            const yearInt = parseInt(year);

            // Get all crew members for this vessel
            const crewMembers = await prisma.crewMember.findMany({
                where: {
                    vessel_id: vesselId,
                    deleted_at: null
                },
                include: {
                    crew_earnings: {
                        where: {
                            month: monthInt,
                            year: yearInt
                        }
                    }
                }
            });

            // Get slopchest consumptions for this month
            const slopchestConsumptions = await prisma.slopchestConsumption.findMany({
                where: {
                    vessel_id: vesselId,
                    month: monthInt,
                    year: yearInt
                }
            });

            // Map crew with earnings and slopchest deductions
            const crewWithEarnings = crewMembers.map((crew: typeof crewMembers[0]) => {
                const earnings = crew.crew_earnings[0] || null;
                
                // Calculate total slopchest deduction for this crew member
                const slopchestTotal = slopchestConsumptions
                    .filter((c: typeof slopchestConsumptions[0]) => c.crew_member_id === crew.id)
                    .reduce((sum: number, c: typeof slopchestConsumptions[0]) => sum + parseFloat(c.total_deduction.toString()), 0);

                // If earnings exist, add slopchest deduction to bond_deduction
                const updatedEarnings = earnings ? {
                    ...earnings,
                    slopchest_deduction: slopchestTotal,
                    bond_deduction: slopchestTotal // This is the slopchest amount for the portage bill
                } : null;

                return {
                    ...crew,
                    earnings: updatedEarnings,
                    slopchest_deduction: slopchestTotal
                };
            });

            return NextResponse.json(crewWithEarnings);
        } catch (error) {
            console.error('Error fetching crew earnings with slopchest:', error);
            return NextResponse.json(
                { error: 'Failed to fetch crew earnings' },
                { status: 500 }
            );
        }
    });
}
