import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to check if date ranges overlap
function dateRangesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 <= end2 && start2 <= end1;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Support both old format and new format
        const { month, hraEntries, hra_data, hra_end_date, vesselId: oldVesselId, year: oldYear } = body;
        
        // Determine if using new or old format
        let isNewFormat = !!(month && hra_data);
        let processData = hra_data || hraEntries;
        let monthValue: number, yearValue: number;
        
        if (isNewFormat && month) {
            // New format: month is YYYY-MM-DD string
            const dateObj = new Date(month);
            monthValue = dateObj.getMonth() + 1;
            yearValue = dateObj.getFullYear();
        } else {
            // Old format: month and year are separate
            monthValue = parseInt(month);
            yearValue = parseInt(oldYear);
        }

        // Validate
        if (!processData || !Array.isArray(processData) || !monthValue || !yearValue) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Check for duplicates/overlaps BEFORE making any changes
        for (const entry of processData) {
            if (!entry.crew_id) continue;
            
            const crewId = entry.crew_id;
            
            if (isNewFormat) {
                const newStartDate = new Date(month);
                const newEndDate = hra_end_date ? new Date(hra_end_date) : newStartDate;
                
                // Get existing HRA entries for this crew in the same month/year
                const existingEntries = await prisma.crewHRAEntry.findMany({
                    where: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue
                    }
                });

                // Check for overlapping date ranges
                for (const existing of existingEntries) {
                    const existingStart = new Date(existing.hra_period_start || existing.hra_date);
                    const existingEnd = new Date(existing.hra_period_end || existing.hra_date);
                    
                    if (dateRangesOverlap(newStartDate, newEndDate, existingStart, existingEnd)) {
                        // Get crew member name for better error message
                        const crewMember = await prisma.crewMember.findUnique({
                            where: { id: crewId }
                        });
                        const crewName = crewMember?.name || `Crew ID ${crewId}`;
                        const existingStartStr = existingStart.toLocaleDateString();
                        const existingEndStr = existingEnd.toLocaleDateString();
                        
                        return NextResponse.json(
                            { 
                                error: `HRA entry already exists for ${crewName} with overlapping dates (${existingStartStr} to ${existingEndStr}). Please choose different dates or delete the existing entry first.`,
                                conflictingEntryId: existing.id,
                                conflictingDates: {
                                    start: existingStartStr,
                                    end: existingEndStr
                                }
                            },
                            { status: 409 }
                        );
                    }
                }
            }
        }

        // Process each entry (no overlaps found)
        for (const entry of processData) {
            if (!entry.crew_id) continue;
            
            const crewId = entry.crew_id;
            let hraAmount = 0;

            if (isNewFormat) {
                // New format: use calculated_amount directly
                hraAmount = parseFloat(String(entry.calculated_amount)) || 0;
            } else {
                // Old format: multiple entries, sum them
                hraAmount = parseFloat(String(entry.hra_amount)) || 0;
            }

            // Create a single HRA entry for the new format (no delete, just add)
            if (isNewFormat) {
                const hraPeriodStart = new Date(month);
                const hraPeriodEnd = hra_end_date ? new Date(hra_end_date) : hraPeriodStart;
                const daysCalculated = entry.days_calculated || 0;

                await prisma.crewHRAEntry.create({
                    data: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue,
                        hra_date: hraPeriodStart,
                        hra_period_start: hraPeriodStart,
                        hra_period_end: hraPeriodEnd,
                        days_calculated: daysCalculated,
                        hra_amount: hraAmount
                    }
                });
            } else {
                // Old format: create multiple entries
                const oldFormatEntries = processData.filter(e => e.crew_id === crewId);
                for (const oldEntry of oldFormatEntries) {
                    await prisma.crewHRAEntry.create({
                        data: {
                            crew_member_id: crewId,
                            month: monthValue,
                            year: yearValue,
                            hra_date: new Date(oldEntry.hra_date),
                            hra_amount: parseFloat(oldEntry.hra_amount)
                        }
                    });
                }
                hraAmount = oldFormatEntries.reduce((sum, e) => sum + parseFloat(String(e.hra_amount)), 0);
            }

            // Calculate total HRA for the month by summing all entries
            const allHRAEntries = await prisma.crewHRAEntry.findMany({
                where: {
                    crew_member_id: crewId,
                    month: monthValue,
                    year: yearValue
                }
            });
            const totalHRA = allHRAEntries.reduce((sum, e) => sum + parseFloat(String(e.hra_amount)), 0);

            // Update CrewMember.hra with total
            await prisma.crewMember.update({
                where: { id: crewId },
                data: { hra: totalHRA }
            });

            // Update CrewEarnings record for this month/year
            const existingEarning = await prisma.crewEarnings.findUnique({
                where: {
                    crew_member_id_month_year: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue
                    }
                }
            });

            if (existingEarning) {
                await prisma.crewEarnings.update({
                    where: { id: existingEarning.id },
                    data: { hra: totalHRA }
                });
            } else {
                // Create new CrewEarnings record if it doesn't exist
                await prisma.crewEarnings.create({
                    data: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue,
                        hra: totalHRA
                    }
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'HRA entries saved successfully'
        });
    } catch (error) {
        console.error('HRA save error:', error);
        return NextResponse.json(
            { error: 'Failed to save HRA entries' },
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

        // Fetch HRA entries for the given month/year and vessel
        const hraEntries = await prisma.crewHRAEntry.findMany({
            where: {
                month: parseInt(month),
                year: parseInt(year),
                crew_members: {
                    vessel_id: parseInt(vesselId)
                }
            },
            include: {
                crew_members: {
                    select: {
                        id: true,
                        name: true,
                        passport_number: true
                    }
                }
            },
            orderBy: {
                crew_member_id: 'asc'
            }
        });

        return NextResponse.json(hraEntries);
    } catch (error) {
        console.error('HRA fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch HRA entries' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Missing HRA entry ID' },
                { status: 400 }
            );
        }

        // Find the HRA entry to get crew_id, month, year for recalculation
        const hraEntry = await prisma.crewHRAEntry.findUnique({
            where: { id: parseInt(id) }
        });

        if (!hraEntry) {
            return NextResponse.json(
                { error: 'HRA entry not found' },
                { status: 404 }
            );
        }

        // Delete the HRA entry
        await prisma.crewHRAEntry.delete({
            where: { id: parseInt(id) }
        });

        // Recalculate total HRA for the crew member in that month
        const remainingEntries = await prisma.crewHRAEntry.findMany({
            where: {
                crew_member_id: hraEntry.crew_member_id,
                month: hraEntry.month,
                year: hraEntry.year
            }
        });

        const totalHRA = remainingEntries.reduce((sum, e) => sum + parseFloat(String(e.hra_amount)), 0);

        // Update CrewMember.hra
        await prisma.crewMember.update({
            where: { id: hraEntry.crew_member_id },
            data: { hra: totalHRA }
        });

        // Update CrewEarnings record
        const existingEarning = await prisma.crewEarnings.findUnique({
            where: {
                crew_member_id_month_year: {
                    crew_member_id: hraEntry.crew_member_id,
                    month: hraEntry.month,
                    year: hraEntry.year
                }
            }
        });

        if (existingEarning) {
            await prisma.crewEarnings.update({
                where: { id: existingEarning.id },
                data: { hra: totalHRA }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'HRA entry deleted successfully'
        });
    } catch (error) {
        console.error('HRA delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete HRA entry' },
            { status: 500 }
        );
    }
}
