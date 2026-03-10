import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAccess } from '@/lib/accessControl';
import * as bcrypt from 'bcrypt';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                user_vessels: {
                    where: { is_active: true },
                    select: { vessel_id: true, role_on_vessel: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdminAccess(request, async (userId) => {
        try {
            const { id } = await params;
            const targetUserId = parseInt(id);
            const body = await request.json();
            const { name, email, password, is_active, selected_vessels } = body;

            const user = await prisma.user.findUnique({
                where: { id: targetUserId }
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            const updateData: any = {};
            if (name) updateData.full_name = name;
            if (email) updateData.email = email;
            if (password) updateData.password_hash = await bcrypt.hash(password, 10);
            if (is_active !== undefined) updateData.is_active = is_active;

            // Update user
            await prisma.user.update({
                where: { id: targetUserId },
                data: updateData
            });

            // Update vessel mappings if provided
            if (selected_vessels && Array.isArray(selected_vessels)) {
                // Delete old mappings
                await prisma.user_vessels.deleteMany({
                    where: { user_id: targetUserId }
                });

                // Create new mappings
                for (const vesselId of selected_vessels) {
                    await prisma.user_vessels.create({
                        data: {
                            user_id: targetUserId,
                            vessel_id: vesselId,
                            role_on_vessel: 'VESSEL_USER'
                        }
                    });
                }
            }

            // Return updated user
            const updatedUser = await prisma.user.findUnique({
                where: { id: targetUserId },
                include: {
                    user_vessels: {
                        where: { is_active: true },
                        select: { vessel_id: true, role_on_vessel: true }
                    }
                }
            });

            return NextResponse.json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            return NextResponse.json(
                { error: 'Failed to update user', details: String(error) },
                { status: 500 }
            );
        }
    });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdminAccess(request, async (userId) => {
        try {
            const { id } = await params;
            const targetUserId = parseInt(id);

            const user = await prisma.user.findUnique({
                where: { id: targetUserId }
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            // Soft delete
            await prisma.user.update({
                where: { id: targetUserId },
                data: { deleted_at: new Date() }
            });

            // Deactivate vessel mappings
            await prisma.user_vessels.updateMany({
                where: { user_id: targetUserId },
                data: { is_active: false }
            });

            return NextResponse.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return NextResponse.json(
                { error: 'Failed to delete user' },
                { status: 500 }
            );
        }
    });
}
