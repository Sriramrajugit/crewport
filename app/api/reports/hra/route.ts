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

        // Format HRA data
        const entries = hraEntries.map(entry => ({
            crew_member_id: entry.crew_member_id,
            crew_name: entry.crew_members.name,
            rank: entry.crew_members.rank || 'N/A',
            start_date: entry.hra_period_start || entry.hra_date,
            end_date: entry.hra_period_end || entry.hra_date,
            days: entry.days_calculated || 0,
            amount: parseFloat(String(entry.hra_amount)),
            entry_id: entry.id
        }));

        const totalAmount = hraEntries.reduce((sum, e) => sum + parseFloat(String(e.hra_amount)), 0);

        return NextResponse.json({
            month: monthValue,
            year: yearValue,
            vessel_id: parseInt(vesselId),
            entries: entries,
            summary: {
                total_entries: hraEntries.length,
                total_days: hraEntries.reduce((sum, e) => sum + (e.days_calculated || 0), 0),
                total_amount: totalAmount
            }
        });
    } catch (error) {
        console.error('HRA report error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch HRA report data' },
            { status: 500 }
        );
    }
}
