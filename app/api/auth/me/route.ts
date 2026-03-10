import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // Get user from session/cookie
        // For now, using mock user ID 1 - replace with actual session handling
        const userId = 1;

        const user = await prisma.user.findUnique({
            where: { id: userId, deleted_at: null },
            include: {
                user_vessels: {
                    where: { is_active: true },
                    include: {
                        vessels: {
                            select: {
                                id: true,
                                vessel_name: true,
                                company_id: true,
                                companies: { select: { company_name: true } }
                            }
                        }
                    }
                },
                users_roles: {
                    select: {
                        role_name: true,
                        permissions: true
                    }
                },
                companies: {
                    select: {
                        id: true,
                        company_name: true
                    }
                }
            }
        });

        if (!user || !user.is_active) {
            return NextResponse.json(
                { error: 'User not found or inactive' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const isAdmin = user.users_roles.role_name === 'ADMIN' || 
                       user.users_roles.role_name === 'SUPER_ADMIN';

        // For admin users, fetch all vessels; otherwise use assigned vessels
        let vessels;
        if (isAdmin) {
            const allVessels = await prisma.vessel.findMany({
                where: { },
                include: {
                    companies: { select: { company_name: true } }
                }
            });
            vessels = allVessels.map((v: any) => ({
                vessel_id: v.id,
                vessel_name: v.vessel_name,
                company_name: v.companies.company_name,
                role_on_vessel: 'ADMIN'
            }));
        } else {
            vessels = user.user_vessels.map((uv: any) => ({
                vessel_id: uv.vessels.id,
                vessel_name: uv.vessels.vessel_name,
                company_name: uv.vessels.companies.company_name,
                role_on_vessel: uv.role_on_vessel
            }));
        }

        // Format response with assigned vessels
        return NextResponse.json({
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.users_roles.role_name,
            company: user.companies,
            assigned_vessels: vessels,
            permissions: user.users_roles.permissions || [],
            is_admin: isAdmin
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
