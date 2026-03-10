import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

// Get consumption records for a vessel and month
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

            const consumptions = await prisma.slopchestConsumption.findMany({
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                include: {
                    crew_members: {
                        select: {
                            id: true,
                            name: true,
                            rank: true
                        }
                    },
                    slopchest_items: {
                        select: {
                            id: true,
                            item_name: true,
                            item_code: true,
                            category: true
                        }
                    }
                },
                orderBy: {
                    crew_members: { name: 'asc' }
                }
            });

            return NextResponse.json(consumptions);
        } catch (error) {
            console.error('Error fetching slopchest consumptions:', error);
            return NextResponse.json(
                { error: 'Failed to fetch consumption records' },
                { status: 500 }
            );
        }
    });
}

// Record consumption for a crew member
export async function POST(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const body = await request.json();
            const { crew_member_id, item_id, consumption_date, month, year, quantity, notes } = body;

            if (!crew_member_id || !item_id || !consumption_date || !month || !year || !quantity) {
                return NextResponse.json(
                    { error: 'Missing required fields: crew_member_id, item_id, consumption_date, month, year, quantity' },
                    { status: 400 }
                );
            }

            // Verify crew member belongs to this vessel
            const crewMember = await prisma.crewMember.findUnique({
                where: { id: parseInt(crew_member_id) }
            });

            if (!crewMember || crewMember.vessel_id !== vesselId) {
                return NextResponse.json(
                    { error: 'Crew member not found or does not belong to this vessel' },
                    { status: 404 }
                );
            }

            // Get item details for unit_price
            const item = await prisma.slopchestItem.findUnique({
                where: { id: parseInt(item_id) }
            });

            if (!item) {
                return NextResponse.json(
                    { error: 'Item not found' },
                    { status: 404 }
                );
            }

            const quantityDecimal = parseFloat(quantity);
            const totalDeduction = quantityDecimal * parseFloat(item.unit_price.toString());

            // Try to create new consumption record
            const consumption = await prisma.slopchestConsumption.create({
                data: {
                    vessel_id: vesselId,
                    crew_member_id: parseInt(crew_member_id),
                    item_id: parseInt(item_id),
                    consumption_date: new Date(consumption_date),
                    month: parseInt(month),
                    year: parseInt(year),
                    quantity: quantityDecimal,
                    unit_price: parseFloat(item.unit_price.toString()),
                    total_deduction: totalDeduction,
                    notes: notes || null,
                    created_by: userId
                },
                include: {
                    crew_members: { select: { id: true, name: true, rank: true } },
                    slopchest_items: { select: { id: true, item_name: true, item_code: true, category: true } }
                }
            });

            return NextResponse.json(consumption, { status: 201 });
        } catch (error: any) {
            console.error('Error creating consumption record:', error);

            // Handle unique constraint violation
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Consumption for this crew member and item already exists for the selected month/year' },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: 'Failed to record consumption', details: error.message },
                { status: 500 }
            );
        }
    });
}
