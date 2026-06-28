import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const vesselId = request.headers.get('X-Vessel-Id');
        if (!vesselId) {
            return NextResponse.json(
                { error: 'Vessel ID required' },
                { status: 400 }
            );
        }

        const { month, travel_wages } = await request.json();

        if (!month || !travel_wages || travel_wages.length === 0) {
            return NextResponse.json(
                { error: 'Month and travel wages data required' },
                { status: 400 }
            );
        }

        // Parse month from YYYY-MM-DD format
        const dateObj = new Date(month);
        const monthNum = dateObj.getMonth() + 1;
        const yearNum = dateObj.getFullYear();

        // Update travel wages for each crew member
        const results = await Promise.all(
            travel_wages.map(async (item: any) => {
                const crewId = item.crew_id;
                const amount = item.calculated_amount;
                const days = item.days || 0;

                // Update CrewMember.travel_wages (latest value)
                await prisma.crewMember.update({
                    where: { id: crewId },
                    data: { travel_wages: amount }
                });

                // Also update CrewEarnings record for this month/year
                const existingEarning = await prisma.crewEarnings.findUnique({
                    where: {
                        crew_member_id_month_year: {
                            crew_member_id: crewId,
                            month: monthNum,
                            year: yearNum
                        }
                    }
                });

                if (existingEarning) {
                    await prisma.crewEarnings.update({
                        where: { id: existingEarning.id },
                        data: { travel_wages: amount }
                    });
                } else {
                    await prisma.crewEarnings.create({
                        data: {
                            crew_member_id: crewId,
                            month: monthNum,
                            year: yearNum,
                            travel_wages: amount
                        }
                    });
                }

                // Create or update CrewTravelWagesEntry for detailed history with days
                const existingEntry = await prisma.crewTravelWagesEntry.findFirst({
                    where: {
                        crew_member_id: crewId,
                        month: monthNum,
                        year: yearNum
                    }
                });

                if (existingEntry) {
                    return await prisma.crewTravelWagesEntry.update({
                        where: { id: existingEntry.id },
                        data: {
                            days_calculated: days,
                            travel_wages_amount: amount,
                            travel_wages_date: new Date(month)
                        }
                    });
                } else {
                    return await prisma.crewTravelWagesEntry.create({
                        data: {
                            crew_member_id: crewId,
                            month: monthNum,
                            year: yearNum,
                            travel_wages_date: new Date(month),
                            days_calculated: days,
                            travel_wages_amount: amount
                        }
                    });
                }
            })
        );

        return NextResponse.json({
            success: true,
            message: 'Travel wages saved successfully',
            updated: results.length
        });
    } catch (error) {
        console.error('Error saving travel wages:', error);
        return NextResponse.json(
            { error: 'Failed to save travel wages' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const vesselId = searchParams.get('vesselId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        if (!vesselId || !month || !year) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Fetch crew travel wages entries with crew details for the given month/year and vessel
        const travelWagesRecords = await prisma.crewTravelWagesEntry.findMany({
            where: {
                month: parseInt(month),
                year: parseInt(year),
                crew_members: {
                    vessel_id: parseInt(vesselId),
                    deleted_at: null
                }
            },
            include: {
                crew_members: {
                    select: {
                        id: true,
                        name: true,
                        rank: true
                    }
                }
            },
            orderBy: {
                crew_member_id: 'asc'
            }
        });

        // Transform to match expected format
        const formattedRecords = travelWagesRecords.map(record => ({
            id: `travel_${record.id}`,
            crew_member_id: record.crew_member_id,
            crew_name: record.crew_members?.name || `Crew ${record.crew_member_id}`,
            rank: record.crew_members?.rank,
            travel_wages_amount: record.travel_wages_amount,
            days_calculated: record.days_calculated || 0
        }));

        return NextResponse.json(formattedRecords);
    } catch (error) {
        console.error('Travel wages fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch travel wages records' },
            { status: 500 }
        );
    }
}
