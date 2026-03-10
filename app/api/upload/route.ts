import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { withVesselAccess } from '@/lib/accessControl';

export async function POST(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const formData = await request.formData();
            const file = formData.get('file') as File;

            if (!file) {
                return NextResponse.json(
                    { error: 'No file provided' },
                    { status: 400 }
                );
            }

            // Validate file type (images only)
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    { error: 'Only image files are allowed' },
                    { status: 400 }
                );
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                return NextResponse.json(
                    { error: 'File size exceeds 5MB limit' },
                    { status: 400 }
                );
            }

            // Create uploads directory if it doesn't exist
            const uploadsDir = join(process.cwd(), 'public', 'uploads', 'contracts');
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true });
            }

            // Generate unique filename with timestamp
            const timestamp = Date.now();
            const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `contract_${timestamp}_${originalName}`;
            const filepath = join(uploadsDir, filename);

            // Convert file to buffer and save
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(filepath, buffer);

            // Return the public URL path
            const publicPath = `/uploads/contracts/${filename}`;

            return NextResponse.json({
                success: true,
                filename: filename,
                url: publicPath,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            return NextResponse.json(
                { error: 'Failed to upload file', details: (error as Error).message },
                { status: 500 }
            );
        }
    });
}
