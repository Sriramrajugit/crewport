import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';
import { saveSession } from '@/lib/session';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email (search across all companies)
        const user = await prisma.user.findFirst({
            where: { 
                email,
                deleted_at: null
            },
            include: {
                users_roles: { select: { role_name: true } },
                user_vessels: {
                    where: { is_active: true },
                    include: {
                        vessels: {
                            select: {
                                id: true,
                                vessel_name: true,
                                companies: { select: { company_name: true } }
                            }
                        }
                    }
                }
            }
        });

        console.log(`[Login Debug] Looking for user: ${email}`);
        console.log(`[Login Debug] User found: ${user ? 'YES' : 'NO'}`);
        
        if (!user) {
            console.log(`[Login Debug] Error: User not found with email: ${email}`);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        console.log(`[Login Debug] User found: ${user.full_name}, Active: ${user.is_active}`);
        console.log(`[Login Debug] Password hash exists: ${user.password_hash ? 'YES' : 'NO'}`);
        console.log(`[Login Debug] Password hash length: ${user.password_hash?.length || 0}`);

        if (!user.is_active) {
            return NextResponse.json(
                { error: 'User account is inactive' },
                { status: 401 }
            );
        }

        // Verify password
        console.log(`[Login Debug] Comparing passwords...`);
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log(`[Login Debug] Password match: ${passwordMatch}`);
        
        if (!passwordMatch) {
            console.log(`[Login Debug] Password mismatch for user: ${email}`);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name,
                role: user.users_roles.role_name,
                is_admin: user.users_roles.role_name === 'ADMIN' || user.users_roles.role_name === 'SUPER_ADMIN'
            }
        });

        // Save session using iron-session
        await saveSession({
            userId: user.id,
            email: user.email,
            name: user.full_name,
            role: user.users_roles.role_name,
            is_admin: user.users_roles.role_name === 'ADMIN' || user.users_roles.role_name === 'SUPER_ADMIN',
            isLoggedIn: true
        });

        console.log(`[Login] User ${email} (ID: ${user.id}) successfully authenticated`);
        
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
