import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAccess } from '@/lib/accessControl';

export async function GET(request: Request) {
    try {
        const ranks = await prisma.rank.findMany({
            where: {
                is_active: true,
            },
            orderBy: {
                rank_name: 'asc',
            },
        });

        return NextResponse.json(ranks);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch ranks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    return withAdminAccess(request, async (userId) => {
        try {
            const body = await request.json();

            if (!body.rank_name || !body.rank_code) {
                return NextResponse.json(
                    { error: 'rank_name and rank_code are required' },
                    { status: 400 }
                );
            }

            const newRank = await prisma.rank.create({
                data: {
                    rank_name: body.rank_name,
                    rank_code: body.rank_code,
                    company_id: body.company_id || null,
                    description: body.description || null,
                    is_active: body.is_active !== false,
                },
            });

            return NextResponse.json(newRank, { status: 201 });
        } catch (error: any) {
            console.error('Error creating rank:', error);
            
            // Handle unique constraint violation
            if (error.code === 'P2002') {
                const target = error.meta?.target;
                return NextResponse.json(
                    { error: `This rank code already exists for the selected company` },
                    { status: 400 }
                );
            }
            
            return NextResponse.json(
                { error: 'Failed to create rank', details: error.message },
                { status: 500 }
            );
        }
    });
}
