import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess } from '@/lib/accessControl';

// Get on-signer consumption records
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

            const allSigners = await prisma.inventoryOnSigner.findMany({
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                include: {
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
                    consumption_date: 'asc'
                }
            });

            // Filter for SLOPCHEST type only
            const signers = allSigners.filter(
                (s) => s.inventory_items?.inventory_type === 'SLOPCHEST'
            );

            // Flatten the response to include item details at the top level
            const flattenedSigners = signers.map((signer: typeof signers[0]) => ({
                ...signer,
                item_code: signer.inventory_items?.item_code || '',
                item_name: signer.inventory_items?.item_name || ''
            }));

            return NextResponse.json(flattenedSigners);
        } catch (error) {
            console.error('Error fetching on-signers:', error);
            return NextResponse.json(
                { error: 'Failed to fetch on-signer records' },
                { status: 500 }
            );
        }
    });
}

// Record consumption for on-signers
export async function POST(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const body = await request.json();
            const { signer_name, item_id, consumption_date, month, year, quantity, remarks } = body;

            if (!signer_name || !item_id || !consumption_date || !month || !year || !quantity) {
                return NextResponse.json(
                    { error: 'Missing required fields: signer_name, item_id, consumption_date, month, year, quantity' },
                    { status: 400 }
                );
            }

            // Get item details and verify it belongs to this vessel
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
            
            // Validate quantity is not negative
            if (quantityDecimal < 0) {
                return NextResponse.json(
                    { error: 'Quantity cannot be negative' },
                    { status: 400 }
                );
            }

            // Validate quantity does not exceed available quantity
            const availableQty = parseFloat(item.available_quantity.toString());
            if (quantityDecimal > availableQty) {
                return NextResponse.json(
                    { error: `Insufficient quantity. Available: ${availableQty}, Requested: ${quantityDecimal}` },
                    { status: 400 }
                );
            }

            const totalDeduction = quantityDecimal * parseFloat(item.unit_price.toString());

            const signer = await prisma.inventoryOnSigner.create({
                data: {
                    vessel_id: vesselId,
                    item_id: parseInt(item_id),
                    signer_name,
                    consumption_date: new Date(consumption_date),
                    month: parseInt(month),
                    year: parseInt(year),
                    quantity: quantityDecimal,
                    unit_price: parseFloat(item.unit_price.toString()),
                    total_deduction: totalDeduction,
                    remarks: remarks || null,
                    created_by: userId
                },
                include: {
                    inventory_items: { select: { id: true, item_name: true, item_code: true, category: true } }
                }
            });

            // Deduct quantity from available inventory
            await prisma.inventoryItem.update({
                where: { id: parseInt(item_id) },
                data: {
                    available_quantity: {
                        decrement: quantityDecimal
                    }
                }
            });

            return NextResponse.json(signer, { status: 201 });
        } catch (error: any) {
            console.error('Error creating on-signer record:', error);
            return NextResponse.json(
                { error: 'Failed to record on-signer consumption', details: error.message },
                { status: 500 }
            );
        }
    });
}
