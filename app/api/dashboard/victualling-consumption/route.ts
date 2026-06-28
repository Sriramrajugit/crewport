import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, isUserAdmin } from '@/lib/accessControl';

interface VictualsConsumptionData {
    vessel_id: number;
    vessel_name: string;
    crew_count: number;
    total_man_days: number;
    total_meals: number;
    month: number;
    year: number;
}

interface SummaryMetrics {
    total_crew: number;
    total_man_days: number;
    total_meals: number;
}

// Get victualling summary per vessel (crew count, man-days, meals)
export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized - no user session' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth() + 1;
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();

        // Get all vessels the user has access to (respect user_vessels table for all users)
        const assignments = await prisma.user_vessels.findMany({
            where: { 
                user_id: userId,
                is_active: true
            },
            select: { vessel_id: true }
        });
        const userVessels = assignments.map((a: { vessel_id: number }) => a.vessel_id);

        if (userVessels.length === 0) {
            return NextResponse.json({
                data: [],
                summary: {
                    total_crew: 0,
                    total_man_days: 0,
                    total_meals: 0
                }
            });
        }

        // Calculate the date range for the month
        const lastDay = new Date(year, month, 0).getDate();
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month - 1, lastDay, 23, 59, 59);

        // Fetch crew members for all user vessels
        const crewMembers = await prisma.crewMember.findMany({
            where: {
                vessel_id: { in: userVessels },
                deleted_at: null
            }
        });

        // Group crew by vessel and calculate metrics
        const vesselCrewMap = new Map<number, any[]>();
        for (const crew of crewMembers) {
            if (!vesselCrewMap.has(crew.vessel_id)) {
                vesselCrewMap.set(crew.vessel_id, []);
            }
            vesselCrewMap.get(crew.vessel_id)!.push(crew);
        }

        // Calculate victualling metrics for each vessel
        const results: VictualsConsumptionData[] = [];
        let aggregatedMetrics: SummaryMetrics = {
            total_crew: 0,
            total_man_days: 0,
            total_meals: 0
        };

        for (const vesselId of userVessels) {
            const vesselCrew = vesselCrewMap.get(vesselId) || [];
            
            // Skip vessels with no crew members for this period
            if (vesselCrew.length === 0) continue;

            const vessel = await prisma.vessel.findUnique({
                where: { id: vesselId }
            });

            if (!vessel) continue;

            // Calculate man-days and meals for this vessel
            let vesselManDays = 0;
            let vesselMeals = 0;

            for (const crew of vesselCrew) {
                const signOnDate = crew.sign_on_date ? new Date(crew.sign_on_date) : null;
                const signOffDate = crew.sign_off_date ? new Date(crew.sign_off_date) : null;

                if (!signOnDate) continue;

                // Calculate man-days in the month
                let mandaysInMonth = 0;

                if (signOnDate <= monthEnd) {
                    const startDay = Math.max(1, signOnDate.getDate());
                    const endDay = signOffDate && signOffDate <= monthEnd 
                        ? signOffDate.getDate() 
                        : lastDay;

                    if (signOnDate.getMonth() === month - 1 && signOnDate.getFullYear() === year) {
                        // Sign on is in this month
                        mandaysInMonth = Math.max(0, endDay - startDay + 1);
                    } else if (!signOffDate || (signOffDate >= monthStart && signOffDate <= monthEnd)) {
                        // Sign off is in this month or crew is ongoing
                        mandaysInMonth = lastDay;
                    }
                }

                vesselManDays += Math.round(mandaysInMonth);
                vesselMeals += Math.round(mandaysInMonth) * 3;
            }

            results.push({
                vessel_id: vesselId,
                vessel_name: vessel.vessel_name,
                crew_count: vesselCrew.length,
                total_man_days: vesselManDays,
                total_meals: vesselMeals,
                month: month,
                year: year
            });

            aggregatedMetrics.total_crew += vesselCrew.length;
            aggregatedMetrics.total_man_days += vesselManDays;
            aggregatedMetrics.total_meals += vesselMeals;
        }

        // Sort by vessel name
        results.sort((a, b) => a.vessel_name.localeCompare(b.vessel_name));

        return NextResponse.json({
            data: results,
            summary: aggregatedMetrics
        });
    } catch (error) {
        console.error('Error fetching victualling consumption:', error);
        return NextResponse.json(
            { error: 'Failed to fetch victualling consumption data' },
            { status: 500 }
        );
    }
}
