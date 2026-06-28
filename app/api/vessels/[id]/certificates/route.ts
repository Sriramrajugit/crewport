import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all certificates for a vessel
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vesselId = parseInt(id);

    const certificates = await prisma.vesselCertificate.findMany({
      where: { vessel_id: vesselId },
      orderBy: { expiry_date: 'asc' },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

// POST - Add certificate
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vesselId = parseInt(id);
    const body = await request.json();

    const certificate = await prisma.vesselCertificate.create({
      data: {
        vessel_id: vesselId,
        certificate_name: body.certificate_name,
        issuing_authority: body.issuing_authority,
        issue_date: body.issue_date ? new Date(body.issue_date) : null,
        expiry_date: body.expiry_date ? new Date(body.expiry_date) : null,
        status: body.status || 'ACTIVE',
      },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}

// PUT - Update certificate
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { certId } = body;

    const certificate = await prisma.vesselCertificate.update({
      where: { id: certId },
      data: {
        certificate_name: body.certificate_name,
        issuing_authority: body.issuing_authority,
        issue_date: body.issue_date ? new Date(body.issue_date) : null,
        expiry_date: body.expiry_date ? new Date(body.expiry_date) : null,
        status: body.status,
      },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}

// DELETE - Remove certificate
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const certId = url.searchParams.get('certId');

    if (!certId) {
      return NextResponse.json(
        { error: 'Certificate ID required' },
        { status: 400 }
      );
    }

    await prisma.vesselCertificate.delete({
      where: { id: parseInt(certId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { error: 'Failed to delete certificate' },
      { status: 500 }
    );
  }
}
