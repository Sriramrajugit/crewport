import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAccess } from '@/lib/accessControl';

export async function GET(request: Request) {
    try {
        const ports = await prisma.port.findMany({
            where: {
                is_active: true,
            },
            orderBy: {
                port_name: 'asc',
            },
        });

        return NextResponse.json(ports);
    } catch (error) {
        console.error('Error fetching ports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ports' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    return withAdminAccess(request, async (userId) => {
        try {
            const body = await request.json();

            if (!body.port_name || !body.port_code) {
                return NextResponse.json(
                    { error: 'port_name and port_code are required' },
                    { status: 400 }
                );
            }

            const newPort = await prisma.port.create({
                data: {
                    port_name: body.port_name,
                    port_code: body.port_code,
                    country: body.country || null,
                    is_active: body.is_active !== false,
                },
            });

            return NextResponse.json(newPort, { status: 201 });
        } catch (error) {
            console.error('Error creating port:', error);
            return NextResponse.json(
                { error: 'Failed to create port', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}
