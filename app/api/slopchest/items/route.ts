import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess, withAdminAccess } from '@/lib/accessControl';

// Get all slopchest items for vessel
export async function GET(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const items = await prisma.inventoryItem.findMany({
                where: {
                    vessel_id: vesselId,
                    inventory_type: 'SLOPCHEST',
                    is_active: true
                },
                orderBy: [
                    { category: 'asc' },
                    { item_name: 'asc' }
                ]
            });

            return NextResponse.json(items);
        } catch (error) {
            console.error('Error fetching slopchest items:', error);
            return NextResponse.json(
                { error: 'Failed to fetch items' },
                { status: 500 }
            );
        }
    });
}

// Create new slopchest item (admin only)
export async function POST(request: NextRequest) {
    return withAdminAccess(request, async (userId) => {
        try {
            const body = await request.json();
            const { company_id, vessel_id, item_name, item_code, unit_price, unit, category } = body;

            if (!company_id || !vessel_id || !item_name || !item_code || !unit_price) {
                return NextResponse.json(
                    { error: 'Missing required fields: company_id, vessel_id, item_name, item_code, unit_price' },
                    { status: 400 }
                );
            }

            const newItem = await prisma.inventoryItem.create({
                data: {
                    company_id: parseInt(company_id),
                    vessel_id: parseInt(vessel_id),
                    inventory_type: 'SLOPCHEST',
                    item_name,
                    item_code,
                    unit_price: parseFloat(unit_price),
                    unit: unit || 'units',
                    category: category || null,
                    is_active: true
                }
            });

            return NextResponse.json(newItem, { status: 201 });
        } catch (error: any) {
            console.error('Error creating slopchest item:', error);

            // Handle unique constraint violation
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Item code already exists for this vessel' },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: 'Failed to create item', details: error.message },
                { status: 500 }
            );
        }
    });
}
