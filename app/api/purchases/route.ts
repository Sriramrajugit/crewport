import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { withVesselAccess, getVesselIdFromRequest } from '@/lib/accessControl';

export async function GET(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const { searchParams } = new URL(request.url);
            const type = searchParams.get('type');

            const whereClause: any = {
                vessel_id: vesselId
            };
            if (type) whereClause.type = type;

        // Filter by company if session has companyId
        const vessel = await prisma.vessel.findUnique({
            where: { id: vesselId },
            select: { company_id: true }
        });

        if (!vessel) {
            return NextResponse.json(
                { message: 'Vessel not found' },
                { status: 404 }
            );
        }

        const purchases = await prisma.purchases.findMany({
            where: whereClause,
            include: {
                vessels: true,
                users_purchases_created_byTousers: {
                    select: { full_name: true, email: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });

        return NextResponse.json(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
    });
}

export async function POST(request: NextRequest) {
    return withVesselAccess(request, async (vesselId, userId) => {
        try {
            const formData = await request.formData();

            const type = formData.get('type') as string;
            const log_period = formData.get('log_period') as string;
            const rfq_no = formData.get('rfq_no') as string;
            const po_no = formData.get('po_no') as string;
            const base_amount_usd = formData.get('base_amount_usd') as string;
            const exchange_rate = formData.get('exchange_rate') as string;
            const invoiceFile = formData.get('invoice_file') as File | null;
            const dnFile = formData.get('dn_file') as File | null;

            // Validation
            if (!type || !log_period || !po_no || !base_amount_usd || !exchange_rate) {
                return NextResponse.json(
                    { message: 'Missing required fields' },
                    { status: 400 }
                );
            }

            // Verify vessel exists (redundant with middleware but explicit)
            const vessel = await prisma.vessel.findUnique({
                where: { id: vesselId },
                select: { company_id: true }
            });

            if (!vessel) {
                return NextResponse.json(
                    { message: 'Vessel not found' },
                    { status: 404 }
                );
            }

            // Handle file uploads
            let invoiceFilePath = null;
            let dnFilePath = null;

            const uploadsDir = join(process.cwd(), 'public/uploads/purchases');
            
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true });
            }

            if (invoiceFile) {
                const bytes = await invoiceFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filename = `invoice_${Date.now()}_${invoiceFile.name}`;
                const filepath = join(uploadsDir, filename);
                await writeFile(filepath, buffer);
                invoiceFilePath = `/uploads/purchases/${filename}`;
            }

            if (dnFile) {
                const bytes = await dnFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filename = `dn_${Date.now()}_${dnFile.name}`;
                const filepath = join(uploadsDir, filename);
                await writeFile(filepath, buffer);
                dnFilePath = `/uploads/purchases/${filename}`;
            }

            // Create purchase record
            const purchase = await prisma.purchases.create({
                data: {
                    company_id: vessel.company_id,
                    vessel_id: vesselId,
                    type,
                    log_period,
                    rfq_no: rfq_no || null,
                    po_no,
                    invoice_file: invoiceFilePath,
                    dn_file: dnFilePath,
                    base_amount_usd: parseFloat(base_amount_usd),
                    exchange_rate: parseFloat(exchange_rate),
                    created_by: userId,
                    approval_status: 'PENDING',
                },
                include: {
                    vessels: true,
                    users_purchases_created_byTousers: {
                        select: { full_name: true, email: true },
                    },
                },
            });

            return NextResponse.json(purchase, { status: 201 });
        } catch (error) {
            console.error('Error creating purchase:', error);
            return NextResponse.json(
                { message: 'Internal server error' },
                { status: 500 }
            );
        }
    });
}
