import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAccess } from '@/lib/accessControl';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        const vessels = await prisma.vessel.findMany({
            where: {
                ...(companyId && { company_id: parseInt(companyId) }),
            },
            orderBy: {
                vessel_name: 'asc',
            },
        });

        return NextResponse.json(vessels);
    } catch (error) {
        console.error('Error fetching vessels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch vessels' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    return withAdminAccess(request, async (userId) => {
        try {
            const body = await request.json();

            if (!body.vessel_name || !body.company_id) {
                return NextResponse.json(
                    { error: 'vessel_name and company_id are required' },
                    { status: 400 }
                );
            }

            const newVessel = await prisma.vessel.create({
                data: {
                    vessel_name: body.vessel_name,
                    company_id: parseInt(body.company_id),
                    imo_number: body.imo_number || null,
                    mmsi_number: body.mmsi_number || null,
                    vessel_type: body.vessel_type || null,
                    flag_state: body.flag_state || null,
                    owner_company: body.owner_company || null,
                    length: body.length ? parseFloat(body.length) : null,
                    beam: body.beam ? parseFloat(body.beam) : null,
                    draft: body.draft ? parseFloat(body.draft) : null,
                    gross_tonnage: body.gross_tonnage ? parseFloat(body.gross_tonnage) : null,
                    net_tonnage: body.net_tonnage ? parseFloat(body.net_tonnage) : null,
                    deadweight_tonnage: body.deadweight_tonnage ? parseFloat(body.deadweight_tonnage) : null,
                    year_built: body.year_built ? parseInt(body.year_built) : null,
                    engine_power: body.engine_power ? parseFloat(body.engine_power) : null,
                    status: body.status || 'ACTIVE',
                },
            });

            return NextResponse.json(newVessel, { status: 201 });
        } catch (error) {
            console.error('Error creating vessel:', error);
            return NextResponse.json(
                { error: 'Failed to create vessel', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}
