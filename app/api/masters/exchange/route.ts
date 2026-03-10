import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAccess } from '@/lib/accessControl';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');
        const latest = searchParams.get('latest');

        // If latest=true, return only the most recent active exchange rate
        if (latest === 'true') {
            let whereClause: any = {
                is_active: true,
            };

            if (companyId) {
                whereClause.company_id = parseInt(companyId);
            } else {
                // Try to get company from session
                const session = request.cookies.get('session')?.value;
                if (session) {
                    const sessionData = JSON.parse(session);
                    whereClause.company_id = sessionData.companyId;
                }
            }

            const rate = await prisma.exchange_rates.findFirst({
                where: whereClause,
                include: {
                    companies: true,
                },
                orderBy: {
                    effective_from: 'desc',
                },
            });

            if (!rate) {
                return NextResponse.json(
                    { error: 'No active exchange rate found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(rate);
        }

        // Return all rates for the company
        const rates = await prisma.exchange_rates.findMany({
            where: {
                ...(companyId && { company_id: parseInt(companyId) }),
                is_active: true,
            },
            include: {
                companies: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return NextResponse.json(rates);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exchange rates' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    return withAdminAccess(request, async (userId) => {
        try {
            const body = await request.json();

            if (!body.company_id || body.usd_to_local === undefined || !body.effective_from || !body.created_by) {
                return NextResponse.json(
                    { error: 'company_id, usd_to_local, effective_from, and created_by are required' },
                    { status: 400 }
                );
            }

            const newRate = await prisma.exchange_rates.create({
                data: {
                    company_id: parseInt(body.company_id),
                    usd_to_local: parseFloat(body.usd_to_local),
                    local_currency_code: body.local_currency_code || 'INR',
                    effective_from: new Date(body.effective_from),
                    effective_to: body.effective_to ? new Date(body.effective_to) : null,
                    created_by: parseInt(body.created_by),
                    is_active: body.is_active !== false,
                },
            });

            return NextResponse.json(newRate, { status: 201 });
        } catch (error) {
            console.error('Error creating exchange rate:', error);
            return NextResponse.json(
                { error: 'Failed to create exchange rate', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}
