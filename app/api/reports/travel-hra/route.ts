import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const vesselId = searchParams.get('vesselId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        if (!vesselId || !month || !year) {
            return NextResponse.json(
                { error: 'Missing required parameters: vesselId, month, year' },
                { status: 400 }
            );
        }

        const monthValue = parseInt(month);
        const yearValue = parseInt(year);

        // Get HRA entries for this month grouped by crew and date range
        const hraEntries = await prisma.crewHRAEntry.findMany({
            where: {
                month: monthValue,
                year: yearValue,
                crew_members: {
                    vessel_id: parseInt(vesselId)
                }
            },
            include: {
                crew_members: {
                    select: {
                        id: true,
                        name: true,
                        rank: true,
                        sign_on_date: true,
                        sign_off_date: true
                    }
                }
            },
            orderBy: [
                { crew_member_id: 'asc' },
                { hra_period_start: 'asc' }
            ]
        });

        // Get Travel Wages entries for this month
        const travelWagesEntries = await prisma.crewTravelWagesEntry.findMany({
            where: {
                month: monthValue,
                year: yearValue,
                crew_members: {
                    vessel_id: parseInt(vesselId)
                }
            },
            include: {
                crew_members: {
                    select: {
                        id: true,
                        name: true,
                        rank: true,
                        sign_on_date: true,
                        sign_off_date: true
                    }
                }
            },
            orderBy: [
                { crew_member_id: 'asc' },
                { travel_wages_date: 'asc' }
            ]
        });

        // Format HRA data
        const hraData = hraEntries.map(entry => ({
            type: 'HRA',
            crew_member_id: entry.crew_member_id,
            crew_name: entry.crew_members.name,
            rank: entry.crew_members.rank || 'N/A',
            start_date: entry.hra_period_start || entry.hra_date,
            end_date: entry.hra_period_end || entry.hra_date,
            days: entry.days_calculated || 0,
            amount: parseFloat(String(entry.hra_amount)),
            entry_id: entry.id
        }));

        // Format Travel Wages data
        const travelData = travelWagesEntries.map(entry => ({
            type: 'TRAVEL_WAGES',
            crew_member_id: entry.crew_member_id,
            crew_name: entry.crew_members.name,
            rank: entry.crew_members.rank || 'N/A',
            start_date: entry.travel_wages_date,
            end_date: entry.travel_wages_date,
            days: entry.days_calculated || 0,
            amount: parseFloat(String(entry.travel_wages_amount)),
            entry_id: entry.id
        }));

        // Combine and sort
        const allData = [...hraData, ...travelData].sort((a, b) => {
            if (a.crew_member_id !== b.crew_member_id) {
                return a.crew_member_id - b.crew_member_id;
            }
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        });

        return NextResponse.json({
            month: monthValue,
            year: yearValue,
            vessel_id: parseInt(vesselId),
            entries: allData,
            summary: {
                total_hra_entries: hraEntries.length,
                total_travel_entries: travelWagesEntries.length,
                total_hra_amount: hraEntries.reduce((sum, e) => sum + parseFloat(String(e.hra_amount)), 0),
                total_travel_amount: travelWagesEntries.reduce((sum, e) => sum + parseFloat(String(e.travel_wages_amount)), 0)
            }
        });
    } catch (error) {
        console.error('Travel & HRA report error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch travel & HRA report data' },
            { status: 500 }
        );
    }
}
