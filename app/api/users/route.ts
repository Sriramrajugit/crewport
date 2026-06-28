import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAccess } from '@/lib/accessControl';
import * as bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
    return withAdminAccess(request, async (userId) => {
        try {
            const users = await prisma.user.findMany({
                where: { deleted_at: null },
                include: {
                    user_vessels: {
                        where: { is_active: true },
                        select: { vessel_id: true, role_on_vessel: true }
                    },
                    users_roles: {
                        select: { role_name: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            });

            // Map users to include role name for frontend
            const mappedUsers = users.map((user: any) => ({
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.users_roles.role_name,
                is_active: user.is_active,
                user_vessels: user.user_vessels
            }));

            return NextResponse.json(mappedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            return NextResponse.json(
                { error: 'Failed to fetch users' },
                { status: 500 }
            );
        }
    });
}

export async function POST(request: NextRequest) {
    return withAdminAccess(request, async (userId) => {
        try {
            const body = await request.json();
            const { name, email, password, role_id, is_active, selected_vessels } = body;

            if (!name || !email || !password) {
                return NextResponse.json(
                    { error: 'Name, email, and password are required' },
                    { status: 400 }
                );
            }

            if (!role_id) {
                return NextResponse.json(
                    { error: 'User role must be selected' },
                    { status: 400 }
                );
            }

            if (!selected_vessels || selected_vessels.length === 0) {
                return NextResponse.json(
                    { error: 'At least one vessel must be assigned' },
                    { status: 400 }
                );
            }

            // Check if this is a VESSEL user role
            const userRole = await prisma.users_roles.findUnique({
                where: { id: role_id },
                select: { role_name: true }
            });

            if (userRole?.role_name === 'VESSEL' && selected_vessels.length > 1) {
                return NextResponse.json(
                    { error: 'Vessel users can only be assigned to one vessel' },
                    { status: 400 }
                );
            }

            // Check if user already exists (using compound unique: company_id + email)
            const existingUser = await prisma.user.findUnique({
                where: {
                    company_id_email: { 
                        company_id: 1,
                        email: email
                    }
                }
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: 'User with this email already exists' },
                    { status: 400 }
                );
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user with provided role_id
            const newUser = await prisma.user.create({
                data: {
                    company_id: 1,
                    user_id: email.split('@')[0],
                    email,
                    password_hash: passwordHash,
                    full_name: name,
                    role_id: role_id,
                    is_active: is_active !== false,
                    created_by: 1
                }
            });

            // Create vessel mappings
            for (const vesselId of selected_vessels) {
                await prisma.user_vessels.create({
                    data: {
                        user_id: newUser.id,
                        vessel_id: vesselId,
                        role_on_vessel: 'VESSEL_USER'
                    }
                });
            }

            // Return user with vessels and role
            const userWithVessels = await prisma.user.findUnique({
                where: { id: newUser.id },
                include: {
                    user_vessels: {
                        where: { is_active: true },
                        select: { vessel_id: true, role_on_vessel: true }
                    },
                    users_roles: {
                        select: { role_name: true }
                    }
                }
            });

            return NextResponse.json({
                id: userWithVessels?.id,
                name: userWithVessels?.full_name,
                email: userWithVessels?.email,
                role: userWithVessels?.users_roles.role_name,
                is_active: userWithVessels?.is_active,
                user_vessels: userWithVessels?.user_vessels
            }, { status: 201 });
        } catch (error) {
            console.error('Error creating user:', error);
            return NextResponse.json(
                { error: 'Failed to create user', details: String(error) },
                { status: 500 }
            );
        }
    });
}
