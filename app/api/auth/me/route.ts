import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/accessControl';

export async function GET(request: NextRequest) {
    try {
        // Try to get user ID from request (will look up by email)
        const userId = await getUserIdFromRequest(request);
        
        if (!userId) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

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

        console.log(`[Auth] User ID: ${userId}, Email: ${user.email}, Role: ${user.users_roles.role_name}, IsAdmin: ${isAdmin}`);

        // For all users (including admin), use assigned vessels only
        // This ensures access control: users can only see vessels they're assigned to
        console.log(`[Auth] Fetching assigned vessels. Found ${user.user_vessels.length} assigned vessels`);
        const vessels = user.user_vessels.map((uv: any) => ({
            vessel_id: uv.vessels.id,
            vessel_name: uv.vessels.vessel_name,
            company_name: uv.vessels.companies.company_name,
            role_on_vessel: isAdmin ? 'ADMIN' : uv.role_on_vessel
        }));

        // Format response with assigned vessels
        console.log(`[Auth/Me] Returning ${vessels.length} vessels for user ${user.email} (Role: ${user.users_roles.role_name})`);
        console.log(`[Auth/Me] Vessels:`, vessels.map((v: any) => v.vessel_name));

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
