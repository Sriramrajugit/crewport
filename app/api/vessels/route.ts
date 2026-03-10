import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        console.log('=== Vessels API GET called ===');
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        console.log('companyId from params:', companyId);

        let whereClause: any = {
            status: 'ACTIVE',
        };

        // If companyId is provided, filter by company
        if (companyId) {
            whereClause.company_id = parseInt(companyId);
        } else {
            // Try to get company from session
            const session = request.cookies.get('session')?.value;
            console.log('Session cookie present:', !!session);
            if (session) {
                try {
                    const sessionData = JSON.parse(session);
                    whereClause.company_id = sessionData.companyId;
                    console.log('companyId from session:', sessionData.companyId);
                } catch (e) {
                    console.log('Failed to parse session');
                }
            }
            
            // If still no company_id, get the first company for development
            if (!whereClause.company_id) {
                console.log('No companyId found, fetching first active company');
                const company = await prisma.company.findFirst({
                    where: { is_active: true }
                });
                if (company) {
                    whereClause.company_id = company.id;
                    console.log('Using company_id:', company.id);
                }
            }
        }

        console.log('Executing Prisma query with where:', whereClause);
        const vessels = await prisma.vessel.findMany({
            where: whereClause,
            orderBy: {
                vessel_name: 'asc'
            }
        });

        console.log('Found vessels:', vessels.length);
        return NextResponse.json(vessels);
    } catch (error) {
        console.error('❌ Error in vessels API GET:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: 'Failed to fetch vessels', details: errorMessage },
            { status: 500 }
        );
    }
}
