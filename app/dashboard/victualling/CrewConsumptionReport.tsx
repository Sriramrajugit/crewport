'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface ConsumptionDetail {
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalDeduction: number;
}

interface CrewConsumption {
  crewId: number;
  crewName: string;
  rank: string;
  consumptions: ConsumptionDetail[];
  crewTotal: number;
  itemCount: number;
}

interface CrewConsumptionReportProps {
  vesselId: number;
  month: number;
  year: number;
  onBack?: () => void;
}

export default function CrewConsumptionReport({
  vesselId,
  month,
  year,
  onBack
}: CrewConsumptionReportProps) {
  const [crewConsumptions, setCrewConsumptions] = useState<CrewConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [expandedCrew, setExpandedCrew] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchData();
  }, [vesselId, month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/victualling/consolidated?vesselId=${vesselId}&month=${month}&year=${year}&format=crew`
      );
      const result = await response.json();

      if (result.items) {
        // Transform API response to crew-focused structure
        const crewMap = new Map<number, CrewConsumption>();

        result.items.forEach((item: any) => {
          item.crewConsumption.forEach((crew: any) => {
            if (crew.quantity > 0) {
              if (!crewMap.has(crew.crewId)) {
                crewMap.set(crew.crewId, {
                  crewId: crew.crewId,
                  crewName: crew.crewName,
                  rank: crew.rank,
                  consumptions: [],
                  crewTotal: 0,
                  itemCount: 0
                });
              }

              const crewData = crewMap.get(crew.crewId)!;
              crewData.consumptions.push({
                itemId: item.itemId,
                itemCode: item.itemCode,
                itemName: item.itemName,
                quantity: crew.quantity,
                unitPrice: item.unitPrice,
                totalDeduction: crew.totalDeduction
              });
              crewData.crewTotal += crew.totalDeduction;
              crewData.itemCount += 1;
            }
          });
        });

        const crewList = Array.from(crewMap.values()).sort(
          (a, b) => b.crewTotal - a.crewTotal
        );

        setCrewConsumptions(crewList);
        setTotalAmount(result.summary.totalAmount);
      }
    } catch (error) {
      console.error('Error fetching crew consumption data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCrew = (crewId: number) => {
    const newExpanded = new Set(expandedCrew);
    if (newExpanded.has(crewId)) {
      newExpanded.delete(crewId);
    } else {
      newExpanded.add(crewId);
    }
    setExpandedCrew(newExpanded);
  };

  const exportToExcel = () => {
    if (crewConsumptions.length === 0) {
      alert('No data to export');
      return;
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1];

    const ws_data: any[] = [
      [`CREW-WISE CONSUMPTION SUMMARY FOR ${monthName.toUpperCase()} ${year}`],
      [],
      ['#', 'Name', 'Rank', 'Items Consumed', 'Total Amount']
    ];

    crewConsumptions.forEach((crew, idx) => {
      ws_data.push([
        idx + 1,
        crew.crewName,
        crew.rank,
        crew.itemCount,
        `$${crew.crewTotal.toFixed(2)}`
      ]);
    });

    ws_data.push([]);
    ws_data.push([
      '',
      `GRAND TOTAL (${crewConsumptions.length} Crew Members)`,
      '',
      '',
      `$${totalAmount.toFixed(2)}`
    ]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Crew Consumption');
    XLSX.writeFile(workbook, `Crew_Consumption_Summary_${monthName}_${year}.xlsx`);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading crew consumption data...</div>;
  }

  if (crewConsumptions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <p className="text-center text-gray-600">
          No consumption data available for this period
        </p>
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[month - 1];

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            CREW-WISE CONSUMPTION SUMMARY
          </h2>
          <p className="text-sm text-gray-600">
            {monthName} {year}
          </p>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold"
            >
              ← Back to Summary
            </button>
          )}
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
          >
            📊 Export to Excel
          </button>
        </div>
      </div>

      {/* Simple Table View */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg mb-6">
        <table className="w-full text-sm">
          <thead className="bg-blue-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900 w-12">
                #
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900">
                NAME
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900">
                RANK
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-900">
                ITEMS CONSUMED
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                TOTAL AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {crewConsumptions.map((crew, idx) => (
              <tr key={crew.crewId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900 text-center">
                  {idx + 1}
                </td>
                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                  {crew.crewName}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {crew.rank}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                  {crew.itemCount}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right font-bold text-green-600">
                  ${crew.crewTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-yellow-100 font-bold">
            <tr>
              <td colSpan={4} className="border border-gray-300 px-4 py-3 text-right">
                GRAND TOTAL ({crewConsumptions.length} Crew Members)
              </td>
              <td className="border border-gray-300 px-4 py-3 text-right text-green-600">
                ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
