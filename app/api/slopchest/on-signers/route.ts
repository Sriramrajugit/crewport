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

            const signers = await prisma.slopchestOnSigner.findMany({
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                include: {
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
                    signer_name: 'asc'
                }
            });

            return NextResponse.json(signers);
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

            // Get item details
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

            const signer = await prisma.slopchestOnSigner.create({
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
                    slopchest_items: { select: { id: true, item_name: true, item_code: true, category: true } }
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
