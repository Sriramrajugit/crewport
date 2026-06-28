import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, isUserAdmin } from '@/lib/accessControl';

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(request);
        if (!userId) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        // Check if user is admin
        const isAdmin = await isUserAdmin(userId);

        // Get user's assigned vessels (for both admin and non-admin users)
        const userVessels = await prisma.user_vessels.findMany({
            where: {
                user_id: userId,
                is_active: true
            },
            select: {
                vessel_id: true
            }
        });

        const assignedVesselIds = userVessels.map((uv: any) => uv.vessel_id);

        if (assignedVesselIds.length === 0) {
            // User has no assigned vessels
            return NextResponse.json([]);
        }

        let whereClause: any = {
            status: 'ACTIVE',
            id: {
                in: assignedVesselIds
            }
        };

        // If companyId is also provided, add it to the filter
        if (companyId) {
            whereClause.company_id = parseInt(companyId);
        } else {
            // Admin without companyId: try to get from session or use first active company
            const session = request.cookies.get('session')?.value;
            if (session) {
                try {
                    const sessionData = JSON.parse(session);
                    whereClause.company_id = sessionData.companyId;
                } catch (e) {
                    // Session parsing failed
                }
            }
            
            // If still no company_id, get the first company for development
            if (!whereClause.company_id) {
                const company = await prisma.company.findFirst({
                    where: { is_active: true }
                });
                if (company) {
                    whereClause.company_id = company.id;
                }
            }
        }

        const vessels = await prisma.vessel.findMany({
            where: whereClause,
            orderBy: {
                vessel_name: 'asc'
            }
        });
        return NextResponse.json(vessels);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: 'Failed to fetch vessels', details: errorMessage },
            { status: 500 }
        );
    }
}
