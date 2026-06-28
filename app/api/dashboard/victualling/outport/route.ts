import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vesselId = parseInt(searchParams.get('vesselId') || '0');
    const month = parseInt(searchParams.get('month') || '');
    const year = parseInt(searchParams.get('year') || '');

    if (!vesselId || !month || !year) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch on-signer consumption data (VICTUALLING type)
    const allOnSignerData = await prisma.inventoryOnSigner.findMany({
      where: {
        vessel_id: vesselId,
        month: month,
        year: year
      },
      include: {
        inventory_items: true
      },
      orderBy: [
        { signer_name: 'asc' },
        { consumption_date: 'asc' }
      ]
    });

    // Filter for VICTUALLING type only
    const onSignerData = allOnSignerData.filter(
      (record) => record.inventory_items?.inventory_type === 'VICTUALLING'
    );

    // Transform data
    const outportData = onSignerData.map((record: any) => ({
      recordId: record.id,
      signerName: record.signer_name,
      itemName: record.inventory_items.item_name,
      category: record.inventory_items.category || 'Uncategorized',
      consumptionDate: new Date(record.consumption_date).toISOString().split('T')[0],
      quantity: Number(record.quantity),
      unitPrice: Number(record.unit_price),
      totalDeduction: Number(record.total_deduction),
      remarks: record.remarks || ''
    }));

    // Get unique signers
    const uniqueSigners = new Set(outportData.map((d: any) => d.signerName));

    // Calculate totals
    const totals = {
      totalQuantity: outportData.reduce((sum: number, item: any) => sum + item.quantity, 0),
      totalDeduction: outportData.reduce((sum: number, item: any) => sum + item.totalDeduction, 0),
      recordCount: outportData.length,
      uniqueSigners: uniqueSigners.size,
      avgDeductionPerSigner: 0
    };

    totals.avgDeductionPerSigner = totals.uniqueSigners > 0
      ? totals.totalDeduction / totals.uniqueSigners
      : 0;

    return NextResponse.json({
      data: outportData,
      totals
    });
  } catch (error) {
    console.error('Error fetching outport data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
