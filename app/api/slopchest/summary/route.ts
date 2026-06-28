import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

// Get slopchest summary (totals per employee)
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

            const monthNum = parseInt(month);
            const yearNum = parseInt(year);

            // Calculate first and last day of the given month/year
            const firstDayOfMonth = new Date(yearNum, monthNum - 1, 1);
            const lastDayOfMonth = new Date(yearNum, monthNum, 0);
            
            firstDayOfMonth.setUTCHours(0, 0, 0, 0);
            lastDayOfMonth.setUTCHours(23, 59, 59, 999);

            // Get crew members who were active during this month
            // (signed on on or before this month AND either not signed off OR signed off after month start)
            const crewMembers = await prisma.crewMember.findMany({
                where: {
                    vessel_id: vesselId,
                    deleted_at: null,
                    // Must have signed on on or before this month
                    sign_on_date: {
                        lte: lastDayOfMonth
                    },
                    // Active records - not signed off or signed off on or after month start
                    OR: [
                        { sign_off_date: null },
                        { sign_off_date: { gte: firstDayOfMonth } }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    rank: true
                },
                orderBy: [
                    { rank: 'asc' },
                    { name: 'asc' }
                ]
            });

            // Get consumption summary per crew member
            const allSummaryData = await prisma.inventoryConsumption.findMany({
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                include: {
                    inventory_items: {
                        select: {
                            inventory_type: true
                        }
                    }
                }
            });

            // Filter for SLOPCHEST only
            const slopchestData = allSummaryData.filter(
                (c) => c.inventory_items?.inventory_type === 'SLOPCHEST'
            );

            // Group by crew_member_id
            const summaryDataGrouped = slopchestData.reduce((acc: any, item: any) => {
                const totalDedNum = parseFloat(item.total_deduction.toString());
                const existing = acc.find((s: any) => s.crew_member_id === item.crew_member_id);
                if (existing) {
                    existing._sum.total_deduction = parseFloat(existing._sum.total_deduction.toString()) + totalDedNum;
                    existing._count.id += 1;
                } else {
                    acc.push({
                        crew_member_id: item.crew_member_id,
                        _sum: { total_deduction: totalDedNum },
                        _count: { id: 1 }
                    });
                }
                return acc;
            }, []);

            // Create summary with crew member details
            const summary = crewMembers.map((crew: any) => {
                const deductionData = summaryDataGrouped.find((s: any) => s.crew_member_id === crew.id);
                return {
                    crew_member_id: crew.id,
                    crew_name: crew.name,
                    rank: crew.rank,
                    item_count: deductionData?._count.id || 0,
                    total_deduction: deductionData?._sum.total_deduction || 0
                };
            });

            // Calculate crew total
            const crewTotal = summary.reduce((sum: number, crew: any) => sum + parseFloat(crew.total_deduction.toString()), 0);

            // Get on-signers total (filter for SLOPCHEST)
            const allOnSigners = await prisma.inventoryOnSigner.findMany({
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                include: {
                    inventory_items: {
                        select: {
                            inventory_type: true
                        }
                    }
                }
            });

            const slopchestOnSigners = allOnSigners.filter(
                (s) => s.inventory_items?.inventory_type === 'SLOPCHEST'
            );

            const onSignersTotal = slopchestOnSigners.reduce(
                (sum, s) => sum + parseFloat(s.total_deduction.toString()),
                0
            );

            return NextResponse.json({
                month: parseInt(month),
                year: parseInt(year),
                crew_summary: summary,
                on_signers_total: onSignersTotal || 0,
                grand_total: crewTotal + (onSignersTotal || 0)
            });
        } catch (error) {
            console.error('Error fetching slopchest summary:', error);
            return NextResponse.json(
                { error: 'Failed to fetch summary' },
                { status: 500 }
            );
        }
    });
}
