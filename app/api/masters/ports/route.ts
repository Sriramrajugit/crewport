import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAccess } from '@/lib/accessControl';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100);
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const search = url.searchParams.get('search') || '';
        const countryCode = url.searchParams.get('country_code') || '';
        const sortBy = url.searchParams.get('sort') || 'name';

        // Build where clause
        const where: any = {
            is_active: true,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (countryCode) {
            where.country_code = countryCode;
        }

        // Get total count for pagination
        const total = await prisma.port.count({ where });

        // Fetch paginated results
        const ports = await prisma.port.findMany({
            where,
            orderBy: {
                [sortBy]: 'asc',
            },
            skip: offset,
            take: limit,
        });

        return NextResponse.json({
            data: ports,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });
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

            if (!body.name || !body.code) {
                return NextResponse.json(
                    { error: 'name and code are required' },
                    { status: 400 }
                );
            }

            const newPort = await prisma.port.create({
                data: {
                    name: body.name,
                    code: body.code,
                    country_code: body.country_code || null,
                    zone_code: body.zone_code || null,
                    latitude: body.latitude ? parseFloat(body.latitude) : null,
                    longitude: body.longitude ? parseFloat(body.longitude) : null,
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
