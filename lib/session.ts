import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface SessionData {
    userId?: number;
    email?: string;
    name?: string;
    role?: string;
    is_admin?: boolean;
    isLoggedIn?: boolean;
}

// Session secret must be at least 32 characters
const sessionSecret = process.env.SESSION_SECRET || 'a-very-complex-password-min-32-characters-long-secret-key-value!@#$%^&*';

if (sessionSecret.length < 32) {
    throw new Error(`SESSION_SECRET must be at least 32 characters, got ${sessionSecret.length}`);
}

const sessionOptions = {
    password: sessionSecret,
    cookieName: 'crewport_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
};

console.log(`[Session] Initialized with secret length: ${sessionSecret.length}, NODE_ENV: ${process.env.NODE_ENV}`);

/**
 * Get session data from request cookies
 * Used in API routes
 */
export async function getSession(request?: NextRequest): Promise<SessionData> {
    try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(
            cookieStore,
            sessionOptions
        );
        console.log(`[Session] Read session - userId: ${session.userId}, isLoggedIn: ${session.isLoggedIn}`);
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return {};
    }
}

/**
 * Save session data
 * Used in API routes
 */
export async function saveSession(sessionData: SessionData): Promise<SessionData> {
    try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(
            cookieStore,
            sessionOptions
        );
        
        Object.assign(session, sessionData);
        await session.save();
        
        console.log(`[Session] Saved session - userId: ${sessionData.userId}, email: ${sessionData.email}`);
        return session;
    } catch (error) {
        console.error('Error saving session:', error);
        return {};
    }
}

/**
 * Clear session
 */
export async function destroySession(): Promise<void> {
    try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(
            cookieStore,
            sessionOptions
        );
        session.destroy();
        console.log(`[Session] Session destroyed`);
    } catch (error) {
        console.error('Error destroying session:', error);
    }
}
