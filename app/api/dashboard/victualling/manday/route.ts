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

    // Get last day of the month
    const lastDay = new Date(year, month, 0).getDate();
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month - 1, lastDay, 23, 59, 59);

    // Fetch crew members who were active during this month
    const crewMembers = await prisma.crewMember.findMany({
      where: {
        vessel_id: vesselId,
        deleted_at: null,
        // Must have signed on on or before this month
        sign_on_date: {
          lte: monthEnd
        },
        // Active during the month - not signed off OR signed off on or after month start
        OR: [
          { sign_off_date: null },
          { sign_off_date: { gte: monthStart } }
        ]
      },
      include: {
        crew_earnings: {
          where: {
            month: month,
            year: year
          }
        }
      }
    });

    // Calculate man-days for each crew member
    const mandayData = crewMembers.map((crew: any) => {
      const signOnDate = new Date(crew.sign_on_date || '');
      const signOffDate = crew.sign_off_date ? new Date(crew.sign_off_date) : null;

      // Calculate man-days in the month
      let mandaysInMonth = 0;
      let daysInMonth = lastDay;

      if (signOnDate <= monthEnd) {
        const startDay = Math.max(1, signOnDate.getDate());
        const endDay = signOffDate && signOffDate <= monthEnd 
          ? signOffDate.getDate() 
          : lastDay;

        if (signOnDate.getMonth() === month - 1 && signOnDate.getFullYear() === year) {
          // Sign on is in this month
          mandaysInMonth = Math.max(0, endDay - startDay + 1);
        } else if (!signOffDate || (signOffDate >= monthStart && signOffDate <= monthEnd)) {
          // Sign off is in this month or crew is ongoing
          mandaysInMonth = daysInMonth;
        }
      }

      // Calculate number of meals (3 meals per day)
      const numberOfMeals = Math.round(mandaysInMonth) * 3;

      return {
        crewMemberId: crew.id,
        crewName: crew.name,
        rank: crew.rank || 'N/A',
        signOnDate: crew.sign_on_date ? new Date(crew.sign_on_date).toISOString().split('T')[0] : 'N/A',
        signOffDate: crew.sign_off_date ? new Date(crew.sign_off_date).toISOString().split('T')[0] : null,
        mandaysInMonth: Math.round(mandaysInMonth),
        numberOfMeals: numberOfMeals
      };
    });

    // Calculate totals
    const totals = {
      totalMandays: mandayData.reduce((sum: number, row: any) => sum + row.mandaysInMonth, 0),
      totalMeals: mandayData.reduce((sum: number, row: any) => sum + row.numberOfMeals, 0),
      crewCount: mandayData.length
    };

    return NextResponse.json({
      data: mandayData,
      totals
    });
  } catch (error) {
    console.error('Error fetching manday data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
