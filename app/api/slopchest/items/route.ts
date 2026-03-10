import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withVesselAccess, withAdminAccess } from '@/lib/accessControl';

// Get all slopchest items for company
export async function GET(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            // Get vessel details to fetch company_id
            const vessel = await prisma.vessel.findUnique({
                where: { id: vesselId },
                select: { company_id: true }
            });

            if (!vessel) {
                return NextResponse.json(
                    { error: 'Vessel not found' },
                    { status: 404 }
                );
            }

            const items = await prisma.slopchestItem.findMany({
                where: {
                    company_id: vessel.company_id,
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
            const { company_id, item_name, item_code, unit_price, unit, category } = body;

            if (!company_id || !item_name || !item_code || !unit_price) {
                return NextResponse.json(
                    { error: 'Missing required fields: company_id, item_name, item_code, unit_price' },
                    { status: 400 }
                );
            }

            const newItem = await prisma.slopchestItem.create({
                data: {
                    company_id: parseInt(company_id),
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
                    { error: 'Item code already exists for this company' },
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
