import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Validate that the user has access to the requested vessel
 * Should be used in API endpoints that are vessel-scoped
 */
export async function validateVesselAccess(
    userId: number,
    vesselId: number
): Promise<{ allowed: boolean; error?: string }> {
    try {
        // Check if user is ADMIN/SUPER_ADMIN (bypass access control)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { users_roles: { select: { role_name: true } } }
        });

        if (!user) {
            return { allowed: false, error: 'User not found' };
        }

        const role = user.users_roles?.role_name || '';
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            return { allowed: true };
        }

        // Check if user has access to this vessel
        const hasAccess = await prisma.user_vessels.findUnique({
            where: {
                user_id_vessel_id: {
                    user_id: userId,
                    vessel_id: vesselId
                }
            }
        });

        if (!hasAccess || !hasAccess.is_active) {
            return { allowed: false, error: 'Access to this vessel is denied' };
        }

        return { allowed: true };
    } catch (error) {
        console.error('Error validating vessel access:', error);
        return { allowed: false, error: 'Server error while validating access' };
    }
}

/**
 * Extract vessel ID from request headers
 * Returns null if not found
 */
export function getVesselIdFromRequest(request: NextRequest): number | null {
    const vesselIdHeader = request.headers.get('X-Vessel-Id');
    if (vesselIdHeader) {
        const vesselId = parseInt(vesselIdHeader);
        if (!isNaN(vesselId)) {
            return vesselId;
        }
    }
    return null;
}

/**
 * Extract user ID from request (from session/auth)
 * This is a placeholder - replace with actual auth mechanism
 */
export function getUserIdFromRequest(request: NextRequest): number | null {
    // TODO: Implement actual session/JWT parsing
    // For now, return mock user ID
    return 1;
}

/**
 * Check if user has ADMIN or SUPER_ADMIN role
 */
export async function isUserAdmin(userId: number): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { users_roles: { select: { role_name: true } } }
        });

        if (!user) {
            return false;
        }

        const role = user.users_roles?.role_name || '';
        return role === 'ADMIN' || role === 'SUPER_ADMIN';
    } catch (error) {
        console.error('Error checking admin role:', error);
        return false;
    }
}

/**
 * Middleware wrapper for admin-only API endpoints
 * Usage:
 * export async function GET(request: NextRequest) {
 *     return withAdminAccess(request, async (userId) => {
 *         // Your admin endpoint logic here
 *         return NextResponse.json({ data });
 *     });
 * }
 */
export async function withAdminAccess(
    request: NextRequest,
    handler: (userId: number) => Promise<NextResponse>
) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized - no user session' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const isAdmin = await isUserAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Forbidden - admin access required' },
                { status: 403 }
            );
        }

        // Call handler with validated user ID
        return await handler(userId);
    } catch (error) {
        console.error('Error in withAdminAccess:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Middleware wrapper for vessel-scoped API endpoints
 * Usage:
 * export async function GET(request: NextRequest) {
 *     return withVesselAccess(request, async (vesselId, userId) => {
 *         // Your endpoint logic here
 *         return NextResponse.json({ data });
 *     });
 * }
 */
export async function withVesselAccess(
    request: NextRequest,
    handler: (vesselId: number, userId: number) => Promise<NextResponse>
) {
    try {
        const userId = getUserIdFromRequest(request);
        const vesselId = getVesselIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized - no user session' },
                { status: 401 }
            );
        }

        if (!vesselId) {
            return NextResponse.json(
                { error: 'Bad request - vessel ID not provided' },
                { status: 400 }
            );
        }

        // Validate access
        const access = await validateVesselAccess(userId, vesselId);
        if (!access.allowed) {
            return NextResponse.json(
                { error: access.error || 'Access denied' },
                { status: 403 }
            );
        }

        // Call handler with validated vessel ID and user ID
        return await handler(vesselId, userId);
    } catch (error) {
        console.error('Error in withVesselAccess:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
