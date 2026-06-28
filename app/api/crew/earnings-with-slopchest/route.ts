import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

// Get crew earnings with inventory deductions included (SLOPCHEST)
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

            // Get inventory consumptions for SLOPCHEST type for this month
            const allConsumptions = await prisma.inventoryConsumption.findMany({
                where: {
                    vessel_id: vesselId,
                    month: monthInt,
                    year: yearInt
                },
                include: {
                    inventory_items: {
                        select: {
                            inventory_type: true
                        }
                    }
                }
            });

            // Filter for SLOPCHEST only (application-layer filtering is more reliable)
            const inventoryConsumptions = allConsumptions.filter(
                (c: typeof allConsumptions[0]) => c.inventory_items?.inventory_type === 'SLOPCHEST'
            );

            // Map crew with earnings and inventory deductions
            const crewWithEarnings = crewMembers.map((crew: typeof crewMembers[0]) => {
                const earnings = crew.crew_earnings[0] || null;
                
                // Calculate total slopchest deduction for this crew member
                const slopchestTotal = inventoryConsumptions
                    .filter((c: typeof inventoryConsumptions[0]) => c.crew_member_id === crew.id)
                    .reduce((sum: number, c: typeof inventoryConsumptions[0]) => sum + parseFloat(c.total_deduction.toString()), 0);

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
            console.error('Error fetching crew earnings with inventory:', error);
            return NextResponse.json(
                { error: 'Failed to fetch crew earnings' },
                { status: 500 }
            );
        }
    });
}
