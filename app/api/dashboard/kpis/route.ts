import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

export async function GET(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            
            // Calculate date 30 days from now
            const thirtyDaysFromNow = new Date(now);
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            // 1. Contracts Expiring in Next 30 Days (crew members with tentative_sign_off_date within 30 days)
            const contractsExpiringIn30Days = await prisma.crewMember.count({
                where: {
                    vessel_id: vesselId,
                    onboarding_status: 'APPROVED',
                    tentative_sign_off_date: {
                        gte: now,
                        lte: thirtyDaysFromNow
                    }
                }
            });

            // 2. Active Vessels (check if this vessel is active)
            const activeVessels = await prisma.vessel.count({
                where: { 
                    id: vesselId,
                    status: 'ACTIVE' 
                }
            });

            // 3. Total Crew Onboard (Approved crew currently onboard - no sign-off date)
            const totalCrewOnboard = await prisma.crewMember.count({
                where: { 
                    vessel_id: vesselId,
                    onboarding_status: 'APPROVED',
                    sign_off_date: null
                }
            });

            // 4. Crew Sign-on This Month
            const crewSignOnThisMonth = await prisma.crewMember.count({
                where: {
                    vessel_id: vesselId,
                    sign_on_date: {
                        gte: firstDayOfMonth,
                        lte: lastDayOfMonth
                    }
                }
            });

            // 5. Crew Sign-off This Month
            const crewSignOffThisMonth = await prisma.crewMember.count({
                where: {
                    vessel_id: vesselId,
                    sign_off_date: {
                        gte: firstDayOfMonth,
                        lte: lastDayOfMonth
                    },
                    crew_status: 'COMPLETED'
                }
            });

            // 6. Pending Requests (crew members waiting for approval)
            // Fetch crew and filter by pending status (case-insensitive)
            const allCrewForVessel = await prisma.crewMember.findMany({
                where: {
                    vessel_id: vesselId,
                    deleted_at: null
                },
                select: {
                    id: true,
                    onboarding_status: true
                }
            });
            const pendingRequests = allCrewForVessel.filter(
                (crew: any) => crew.onboarding_status?.toUpperCase() === 'PENDING'
            ).length;

            // 7. Monthly Fleet Expense (current month purchases total for this vessel)
            const monthlyExpenseResult = await prisma.purchases.aggregate({
                _sum: {
                    total_local: true
                },
                where: {
                    vessel_id: vesselId,
                    created_at: {
                        gte: firstDayOfMonth,
                        lte: lastDayOfMonth
                    }
                }
            });
            const monthlyFleetExpense = monthlyExpenseResult._sum.total_local || 0;

            // 8. Avg Crew Per Vessel (always 1 since we're looking at 1 vessel)
            const avgCrewPerVessel = totalCrewOnboard;

            return NextResponse.json({
                contractsExpiringIn30Days,
                activeVessels,
                totalCrewOnboard,
                crewSignOnThisMonth,
                crewSignOffThisMonth,
                pendingRequests,
                monthlyFleetExpense,
                avgCrewPerVessel
            });
        } catch (error) {
            console.error('Error fetching KPIs:', error);
            return NextResponse.json(
                { error: 'Failed to fetch KPIs', details: String(error) },
                { status: 500 }
            );
        }
    });
}
