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

            // Get all crew members for this vessel
            const crewMembers = await prisma.crewMember.findMany({
                where: {
                    vessel_id: vesselId,
                    deleted_at: null,
                    // Optional: Filter for active crew on date
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
            const summaryData = await prisma.slopchestConsumption.groupBy({
                by: ['crew_member_id'],
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                _sum: {
                    total_deduction: true
                },
                _count: {
                    id: true
                }
            });

            // Create summary with crew member details
            const summary = crewMembers.map((crew: any) => {
                const deductionData = summaryData.find((s: any) => s.crew_member_id === crew.id);
                return {
                    crew_member_id: crew.id,
                    crew_name: crew.name,
                    rank: crew.rank,
                    item_count: deductionData?._count.id || 0,
                    total_deduction: deductionData?._sum.total_deduction || 0
                };
            });

            // Get on-signers total
            const onSignersTotal = await prisma.slopchestOnSigner.aggregate({
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                _sum: {
                    total_deduction: true
                }
            });

            return NextResponse.json({
                month: parseInt(month),
                year: parseInt(year),
                crew_summary: summary,
                on_signers_total: onSignersTotal._sum.total_deduction || 0,
                grand_total: summary.reduce((sum: number, crew: any) => sum + parseFloat(crew.total_deduction.toString()), 0) + 
                             parseFloat((onSignersTotal._sum.total_deduction || 0).toString())
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
