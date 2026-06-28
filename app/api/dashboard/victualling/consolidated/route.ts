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
    const format = searchParams.get('format') || 'inventory'; // 'inventory', 'simple', or 'crew'

    if (!vesselId || !month || !year) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (format === 'inventory') {
      // Inventory Statement format - Group by Items
      // Get all VICTUALLING items for this vessel
      const items = await prisma.inventoryItem.findMany({
        where: {
          vessel_id: vesselId,
          inventory_type: 'VICTUALLING',
          is_active: true
        },
        orderBy: [{ category: 'asc' }, { item_name: 'asc' }]
      });

      // Get consumption data for current month
      const allCurrentMonthConsumptions = await prisma.inventoryConsumption.findMany({
        where: {
          vessel_id: vesselId,
          month,
          year
        },
        include: {
          inventory_items: true
        }
      });

      // Filter for VICTUALLING type
      const currentMonthConsumptions = allCurrentMonthConsumptions.filter(
        (c) => c.inventory_items?.inventory_type === 'VICTUALLING'
      );

      // Get consumption data for previous month (for opening balance)
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      
      const allPreviousMonthConsumptions = await prisma.inventoryConsumption.findMany({
        where: {
          vessel_id: vesselId,
          month: prevMonth,
          year: prevYear
        },
        include: {
          inventory_items: true
        }
      });

      // Filter for VICTUALLING type
      const previousMonthConsumptions = allPreviousMonthConsumptions.filter(
        (c) => c.inventory_items?.inventory_type === 'VICTUALLING'
      );

      // Get purchases for current month (if available)
      const currentMonthPurchases = await prisma.purchases.findMany({
        where: {
          vessel_id: vesselId,
          created_at: {
            gte: new Date(year, month - 1, 1),
            lte: new Date(year, month, 0)
          }
        }
      });

      // Build inventory statement
      const inventoryData = items.map((item: any) => {
        // Calculate current month consumption
        const currentConsumption = currentMonthConsumptions
          .filter((c: any) => c.item_id === item.id)
          .reduce((sum: number, c: any) => sum + parseFloat(c.quantity.toString()), 0);

        // Calculate previous month consumption (used as closing balance for prev month)
        const prevMonthConsumption = previousMonthConsumptions
          .filter((c: any) => c.item_id === item.id)
          .reduce((sum: number, c: any) => sum + parseFloat(c.quantity.toString()), 0);

        // For opening balance, we use the closing balance from previous month
        // Closing balance from prev month = Opening balance - Consumption
        // Since we don't have explicit opening balance, we assume items ordered match consumption
        const openingBalance = 0; // Will be updated with actual opening balance from previous month if needed
        
        // Purchase amount (for now, using 0 as we don't have item-level purchase tracking)
        const purchaseQuantity = 0;

        // Total ROB = Opening + Purchase
        const totalROB = openingBalance + purchaseQuantity;

        // Closing/EOB = Total ROB - Consumption
        const closingBalance = totalROB - currentConsumption;

        return {
          itemId: item.id,
          itemCode: item.item_code,
          itemName: item.item_name,
          category: item.category || 'Uncategorized',
          unit: item.unit,
          unitPrice: parseFloat(item.unit_price.toString()),
          openingBalance,
          purchaseQuantity,
          totalROB,
          consumptionQuantity: currentConsumption,
          closingBalance,
          totalAmount: currentConsumption * parseFloat(item.unit_price.toString())
        };
      });

      // Calculate totals
      const totals = {
        totalOpeningBalance: inventoryData.reduce((sum: number, item: any) => sum + item.openingBalance, 0),
        totalPurchase: inventoryData.reduce((sum: number, item: any) => sum + item.purchaseQuantity, 0),
        totalROB: inventoryData.reduce((sum: number, item: any) => sum + item.totalROB, 0),
        totalConsumption: inventoryData.reduce((sum: number, item: any) => sum + item.consumptionQuantity, 0),
        totalClosingBalance: inventoryData.reduce((sum: number, item: any) => sum + item.closingBalance, 0),
        totalAmount: inventoryData.reduce((sum: number, item: any) => sum + item.totalAmount, 0)
      };

      return NextResponse.json({
        format: 'inventory',
        month,
        year,
        vessel: { id: vesselId },
        items: inventoryData,
        totals
      });
    }

    if (format === 'crew' || format === 'detailed') {
      // Crew consumption format
      // Get all crew members for the vessel
      const crewMembers = await prisma.crewMember.findMany({
        where: {
          vessel_id: vesselId,
          deleted_at: null
        },
        select: {
          id: true,
          name: true,
          rank: true
        },
        orderBy: [{ rank: 'asc' }, { name: 'asc' }]
      });

      // Get all VICTUALLING items for this vessel
      const items = await prisma.inventoryItem.findMany({
        where: {
          vessel_id: vesselId,
          inventory_type: 'VICTUALLING',
          is_active: true
        },
        orderBy: [{ category: 'asc' }, { item_name: 'asc' }]
      });

      // Get consumption data for the month
      const allConsumptions = await prisma.inventoryConsumption.findMany({
        where: {
          vessel_id: vesselId,
          month,
          year
        },
        include: {
          inventory_items: true
        }
      });

      // Filter for VICTUALLING type
      const consumptions = allConsumptions.filter(
        (c) => c.inventory_items?.inventory_type === 'VICTUALLING'
      );

      // Build crew consumption data structure
      const crewConsumptionData = items.map((item: any) => ({
        itemId: item.id,
        itemName: item.item_name,
        itemCode: item.item_code,
        category: item.category || 'Uncategorized',
        unit: item.unit,
        unitPrice: parseFloat(item.unit_price.toString()),
        crewConsumption: crewMembers.map((crew: any) => {
          const consumption = consumptions.find(
            (c: any) => c.crew_member_id === crew.id && c.item_id === item.id
          );
          return {
            crewId: crew.id,
            crewName: crew.name,
            rank: crew.rank,
            quantity: consumption ? parseFloat(consumption.quantity.toString()) : 0,
            totalDeduction: consumption ? parseFloat(consumption.total_deduction.toString()) : 0
          };
        })
      }));

      // Calculate totals
      const totalAmount = consumptions.reduce(
        (sum: number, c: any) => sum + parseFloat(c.total_deduction.toString()),
        0
      );

      return NextResponse.json({
        format: 'crew',
        month,
        year,
        vessel: {
          id: vesselId
        },
        crewMembers: crewMembers.map((c: any) => ({ id: c.id, name: c.name, rank: c.rank })),
        items: crewConsumptionData,
        summary: {
          totalItems: items.length,
          totalCrew: crewMembers.length,
          totalAmount
        }
      });
    }

    // Original simple format
    // Fetch consumption data grouped by item
    const allSimpleConsumptions = await prisma.inventoryConsumption.findMany({
      where: {
        vessel_id: vesselId,
        month: month,
        year: year
      },
      include: {
        inventory_items: true
      }
    });

    // Filter for VICTUALLING type
    const simpleConsumptions = allSimpleConsumptions.filter(
      (c) => c.inventory_items?.inventory_type === 'VICTUALLING'
    );

    // Group by item
    const itemMap = new Map();
    
    simpleConsumptions.forEach((consumption: any) => {
      const itemId = consumption.item_id;
      if (!itemMap.has(itemId)) {
        itemMap.set(itemId, {
          itemId: consumption.inventory_items.id,
          itemName: consumption.inventory_items.item_name,
          category: consumption.inventory_items.category || 'Uncategorized',
          unit: consumption.inventory_items.unit,
          totalQuantity: 0,
          unitPrice: 0,
          totalAmount: 0,
          crewAffected: new Set()
        });
      }
      
      const item = itemMap.get(itemId);
      item.totalQuantity += Number(consumption.quantity);
      item.unitPrice = Number(consumption.unit_price);
      item.totalAmount += Number(consumption.total_deduction);
      if (consumption.crew_member_id) {
        item.crewAffected.add(consumption.crew_member_id);
      }
    });

    // Convert Set to count
    const consolidatedData = Array.from(itemMap.values()).map(item => ({
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.category,
      unit: item.unit,
      totalQuantity: Number(item.totalQuantity.toFixed(2)),
      unitPrice: Number(item.unitPrice.toFixed(2)),
      totalAmount: Number(item.totalAmount.toFixed(2)),
      crewAffected: item.crewAffected.size
    }));

    // Calculate totals
    const totals = {
      totalQuantity: consolidatedData.reduce((sum, item) => sum + item.totalQuantity, 0),
      totalAmount: consolidatedData.reduce((sum, item) => sum + item.totalAmount, 0),
      itemCount: consolidatedData.length,
      crewCount: new Set(simpleConsumptions.map((c: any) => c.crew_member_id).filter(Boolean)).size,
      avgCostPerCrew: 0
    };

    totals.avgCostPerCrew = totals.crewCount > 0 
      ? totals.totalAmount / totals.crewCount 
      : 0;

    return NextResponse.json({
      format: 'simple',
      data: consolidatedData,
      totals
    });
  } catch (error) {
    console.error('Error fetching consolidated data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
