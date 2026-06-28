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

        // Format Travel Wages data
        const entries = travelWagesEntries.map(entry => ({
            crew_member_id: entry.crew_member_id,
            crew_name: entry.crew_members.name,
            rank: entry.crew_members.rank || 'N/A',
            date: entry.travel_wages_date,
            days: entry.days_calculated || 0,
            amount: parseFloat(String(entry.travel_wages_amount)),
            entry_id: entry.id
        }));

        const totalAmount = travelWagesEntries.reduce((sum, e) => sum + parseFloat(String(e.travel_wages_amount)), 0);

        return NextResponse.json({
            month: monthValue,
            year: yearValue,
            vessel_id: parseInt(vesselId),
            entries: entries,
            summary: {
                total_entries: travelWagesEntries.length,
                total_days: travelWagesEntries.reduce((sum, e) => sum + (e.days_calculated || 0), 0),
                total_amount: totalAmount
            }
        });
    } catch (error) {
        console.error('Travel Wages report error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch travel wages report data' },
            { status: 500 }
        );
    }
}
