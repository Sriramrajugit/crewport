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

            const consumptions = await prisma.inventoryConsumption.findMany({
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
                    inventory_items: {
                        select: {
                            id: true,
                            item_name: true,
                            item_code: true,
                            category: true,
                            inventory_type: true
                        }
                    }
                },
                orderBy: {
                    crew_members: { name: 'asc' }
                }
            });

            // Filter for SLOPCHEST type only in application
            const slopchestConsumptions = consumptions.filter(
                (c) => c.inventory_items?.inventory_type === 'SLOPCHEST'
            );

            return NextResponse.json(slopchestConsumptions);
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

            // Verify crew member is/was active during the specified month
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            const firstDayOfMonth = new Date(yearNum, monthNum - 1, 1);
            const lastDayOfMonth = new Date(yearNum, monthNum, 0);
            
            firstDayOfMonth.setUTCHours(0, 0, 0, 0);
            lastDayOfMonth.setUTCHours(23, 59, 59, 999);

            const signOnDate = new Date(crewMember.sign_on_date!);
            signOnDate.setUTCHours(0, 0, 0, 0);

            // Check if crew member has NOT joined yet
            if (signOnDate > lastDayOfMonth) {
                return NextResponse.json(
                    { error: `Crew member has not joined yet. Joining on: ${crewMember.sign_on_date?.toISOString().split('T')[0]}` },
                    { status: 400 }
                );
            }

            // Check if crew member has been relieved BEFORE this month
            if (crewMember.sign_off_date) {
                const signOffDate = new Date(crewMember.sign_off_date);
                signOffDate.setUTCHours(0, 0, 0, 0);
                
                const consumptionDateObj = new Date(consumption_date);
                consumptionDateObj.setUTCHours(0, 0, 0, 0);
                
                // No entries allowed on or after the sign_off_date
                if (consumptionDateObj >= signOffDate) {
                    return NextResponse.json(
                        { error: `Cannot record slopchest: Crew member was relieved on ${crewMember.sign_off_date.toISOString().split('T')[0]}. No entries allowed on or after the exit date.` },
                        { status: 400 }
                    );
                }
            }

            // Get item details for unit_price and verify it belongs to this vessel
            const item = await prisma.inventoryItem.findUnique({
                where: { id: parseInt(item_id) }
            });

            if (!item || item.vessel_id !== vesselId) {
                return NextResponse.json(
                    { error: 'Item not found or does not belong to this vessel' },
                    { status: 404 }
                );
            }

            const quantityDecimal = parseFloat(quantity);
            
            // Validate quantity is greater than 0 (not negative or zero)
            if (quantityDecimal <= 0) {
                return NextResponse.json(
                    { error: 'Quantity must be greater than 0' },
                    { status: 400 }
                );
            }

            // Check if item is out of stock
            const availableQty = parseFloat(item.available_quantity.toString());
            if (availableQty <= 0) {
                return NextResponse.json(
                    { error: `Cannot consume: Item "${item.item_name}" is out of stock (Available: 0)` },
                    { status: 400 }
                );
            }

            const totalDeduction = quantityDecimal * parseFloat(item.unit_price.toString());
            const consumptionDateObj = new Date(consumption_date);

            // Check if a consumption already exists for this same crew/item/day
            const existingConsumption = await prisma.inventoryConsumption.findFirst({
                where: {
                    vessel_id: vesselId,
                    crew_member_id: parseInt(crew_member_id),
                    item_id: parseInt(item_id),
                    consumption_date: consumptionDateObj
                }
            });

            const previousQuantity = existingConsumption ? parseFloat(existingConsumption.quantity.toString()) : 0;
            const quantityDifference = quantityDecimal - previousQuantity;

            // Validate we have enough inventory for the net adjustment (only if increasing quantity)
            if (quantityDifference > 0) {
                if (availableQty < quantityDifference) {
                    return NextResponse.json(
                        { error: `Insufficient quantity. Available: ${availableQty}, Additional needed: ${quantityDifference}` },
                        { status: 400 }
                    );
                }
            }

            let consumption;
            if (existingConsumption) {
                // Update existing consumption
                consumption = await prisma.inventoryConsumption.update({
                    where: { id: existingConsumption.id },
                    data: {
                        quantity: quantityDecimal,
                        unit_price: parseFloat(item.unit_price.toString()),
                        total_deduction: totalDeduction,
                        notes: notes || null,
                        updated_at: new Date()
                    },
                    include: {
                        crew_members: { select: { id: true, name: true, rank: true } },
                        inventory_items: { select: { id: true, item_name: true, item_code: true, category: true } }
                    }
                });
            } else {
                // Create new consumption
                consumption = await prisma.inventoryConsumption.create({
                    data: {
                        vessel_id: vesselId,
                        crew_member_id: parseInt(crew_member_id),
                        item_id: parseInt(item_id),
                        consumption_date: consumptionDateObj,
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
                        inventory_items: { select: { id: true, item_name: true, item_code: true, category: true } }
                    }
                });
            }

            // Adjust inventory quantity by the difference
            if (quantityDifference !== 0) {
                console.log(`[Consumption] Adjusting inventory for item ${item_id}: decreasing by ${quantityDifference}`);
                await prisma.inventoryItem.update({
                    where: { id: parseInt(item_id) },
                    data: {
                        available_quantity: {
                            decrement: quantityDifference
                        }
                    }
                });
                console.log(`[Consumption] Inventory adjusted successfully`);
            }

            // Fetch the updated item to return updated quantity to frontend
            const updatedItem = await prisma.inventoryItem.findUnique({
                where: { id: parseInt(item_id) }
            });

            // Return response with updated item data
            const response = {
                ...consumption,
                updated_item: {
                    id: updatedItem?.id,
                    available_quantity: updatedItem?.available_quantity
                }
            };

            return NextResponse.json(response, { status: 201 });
        } catch (error: any) {
            console.error('Error creating/updating consumption record:', error);
            return NextResponse.json(
                { error: 'Failed to record consumption', details: error.message },
                { status: 500 }
            );
        }
    });
}
