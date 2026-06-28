import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/accessControl';

interface KPIData {
    vessel_id: number;
    vessel_name: string;
    pendingRequests: number;
    crewSignOnThisMonth: number;
    crewSignOffThisMonth: number;
    totalCrewOnboard: number;
    contractsExpiringIn30Days: number;
    hraTransitDays: number;
}

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        // Get user info to check role
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { users_roles: { select: { role_name: true } } }
        });

        console.log(`[Dashboard] User ID: ${userId}, Role: ${user?.users_roles.role_name}`);

        // Get all vessels tagged to this user
        const userVessels = await prisma.user_vessels.findMany({
            where: {
                user_id: userId,
                is_active: true
            },
            include: {
                vessels: true
            }
        });

        console.log(`[Dashboard] User ${userId} (${user?.email}) has ${userVessels.length} active vessel tags:`, userVessels.map((uv: any) => uv.vessels.vessel_name));

        if (userVessels.length === 0) {
            console.log(`[Dashboard] No vessels found, returning empty`);
            return NextResponse.json({
                vessels: [],
                totalVesselsTagged: 0
            });
        }

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const thirtyDaysFromNow = new Date(now);
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        // Fetch KPIs for each vessel
        const vesselKPIs: KPIData[] = await Promise.all(
            userVessels.map(async (uv: any) => {
                const vesselId = uv.vessel_id;
                const vesselName = uv.vessels.vessel_name;

                // Get crew members for this vessel first
                const crewMembers = await prisma.crewMember.findMany({
                    where: {
                        vessel_id: vesselId,
                        deleted_at: null
                    },
                    select: { 
                        id: true,
                        onboarding_status: true,
                        sign_on_date: true,
                        sign_off_date: true,
                        crew_status: true,
                        tentative_sign_off_date: true
                    }
                });

                const crewIds = crewMembers.map(c => c.id);

                // Now fetch all KPI metrics
                const [
                    pendingRequests,
                    crewSignOnThisMonth,
                    crewSignOffThisMonth,
                    totalCrewOnboard,
                    contractsExpiringIn30Days,
                    hraTransitDays
                ] = await Promise.all([
                    // Count pending crew from already fetched data
                    Promise.resolve(
                        crewMembers.filter(c => c.onboarding_status?.toUpperCase() === 'PENDING').length
                    ),
                    // Count crew signed on this month
                    prisma.crewMember.count({
                        where: {
                            vessel_id: vesselId,
                            sign_on_date: {
                                gte: firstDayOfMonth,
                                lte: lastDayOfMonth
                            }
                        }
                    }),
                    // Count crew signed off this month
                    prisma.crewMember.count({
                        where: {
                            vessel_id: vesselId,
                            sign_off_date: {
                                gte: firstDayOfMonth,
                                lte: lastDayOfMonth
                            },
                            crew_status: 'COMPLETED'
                        }
                    }),
                    // Count total crew onboard
                    prisma.crewMember.count({
                        where: {
                            vessel_id: vesselId,
                            onboarding_status: 'APPROVED',
                            sign_off_date: null
                        }
                    }),
                    // Count contracts expiring in 30 days
                    prisma.crewMember.count({
                        where: {
                            vessel_id: vesselId,
                            onboarding_status: 'APPROVED',
                            tentative_sign_off_date: {
                                gte: now,
                                lte: thirtyDaysFromNow
                            }
                        }
                    }),
                    // Count HRA entries for crew members of this vessel
                    crewIds.length > 0
                        ? prisma.crewHRAEntry.count({
                            where: {
                                month: now.getMonth() + 1,
                                year: now.getFullYear(),
                                crew_member_id: {
                                    in: crewIds
                                }
                            }
                        })
                        : Promise.resolve(0)
                ]);

                return {
                    vessel_id: vesselId,
                    vessel_name: vesselName,
                    pendingRequests,
                    crewSignOnThisMonth,
                    crewSignOffThisMonth,
                    totalCrewOnboard,
                    contractsExpiringIn30Days,
                    hraTransitDays
                };
            })
        );

        return NextResponse.json({
            vessels: vesselKPIs,
            totalVesselsTagged: userVessels.length
        });
    } catch (error) {
        console.error('Error fetching all KPIs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch KPIs', details: String(error) },
            { status: 500 }
        );
    }
}
