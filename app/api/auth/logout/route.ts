import { NextResponse, NextRequest } from 'next/server';
import { destroySession } from '@/lib/session';

export async function POST(request: NextRequest) {
    try {
        // Destroy the session
        await destroySession();

        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

        console.log('[Logout] User logged out');
        
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'An error occurred during logout' },
            { status: 500 }
        );
    }
}
