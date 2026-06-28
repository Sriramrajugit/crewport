'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface CrewMember {
  id: number;
  name: string;
  rank: string;
}

interface CrewConsumption {
  crewId: number;
  crewName: string;
  rank: string;
  quantity: number;
  totalDeduction: number;
}

interface ItemData {
  itemId: number;
  itemName: string;
  itemCode: string;
  category: string;
  unit: string;
  unitPrice: number;
  crewConsumption: CrewConsumption[];
}

interface ReceiptStatementProps {
  vesselId: number;
  month: number;
  year: number;
  onBack?: () => void;
}

export default function ReceiptConsumptionStatement({
  vesselId,
  month,
  year,
  onBack
}: ReceiptStatementProps) {
  const [data, setData] = useState<ItemData[]>([]);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

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
        setData(result.items);
        setCrewMembers(result.crewMembers);
        setTotalAmount(result.summary.totalAmount);
      }
    } catch (error) {
      console.error('Error fetching crew consumption data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1];

    // Create header rows
    const ws_data: any[] = [
      [`RECEIPT & CONSUMPTION STATEMENT FOR THE MONTH OF ${monthName.toUpperCase()} ${year}`],
      ['(ALL AMOUNTS IN US DOLLARS)'],
      [],
      ['ITEM', 'UNIT PRICE', ...crewMembers.flatMap(crew => [
        `${crew.name.toUpperCase()}`,
        'Weight/Unit',
        'UNIT SGD',
        'UNIT USD',
        'USD'
      ]), 'TOTAL']
    ];

    // Add data rows
    data.forEach(item => {
      const row: any[] = [item.itemName, item.unitPrice];
      let itemTotal = 0;

      crewMembers.forEach(crew => {
        const consumption = item.crewConsumption.find(c => c.crewId === crew.id);
        const qty = consumption?.quantity || 0;
        const total = consumption?.totalDeduction || 0;
        row.push(qty, '', '', '', total);
        itemTotal += total;
      });

      row.push(itemTotal);
      ws_data.push(row);
    });

    // Add total row
    ws_data.push([]);
    const totalRow: any[] = ['TOTAL PURCHASE', ''];
    let grandTotal = 0;
    crewMembers.forEach(() => {
      totalRow.push('', '', '', '', '');
    });
    totalRow.push(totalAmount);
    ws_data.push(totalRow);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Receipt & Consumption');
    XLSX.writeFile(workbook, `Receipt_Consumption_${monthName}_${year}.xlsx`);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading receipt statement...</div>;
  }

  if (data.length === 0) {
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
            RECEIPT & CONSUMPTION STATEMENT
          </h2>
          <p className="text-sm text-gray-600">
            {monthName} {year} | (All amounts in US Dollars)
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

      {/* Detailed Table with crew columns */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-blue-100 sticky top-0">
            <tr>
              <th
                colSpan={2}
                className="border border-gray-300 px-3 py-2 text-left font-bold"
              >
                ITEM CODE
              </th>
              {crewMembers.map((crew) => (
                <th
                  key={crew.id}
                  colSpan={5}
                  className="border border-gray-300 px-2 py-2 text-center font-bold bg-blue-50"
                >
                  {crew.name}
                </th>
              ))}
              <th className="border border-gray-300 px-2 py-2 text-right font-bold bg-green-50">
                TOTAL
              </th>
            </tr>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs">ITEM</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-xs">UNIT PRICE</th>
              {crewMembers.map((crew) => (
                <React.Fragment key={crew.id}>
                  <th className="border border-gray-300 px-1 py-1 text-center text-xs">Weight</th>
                  <th className="border border-gray-300 px-1 py-1 text-center text-xs">Unit SGD</th>
                  <th className="border border-gray-300 px-1 py-1 text-center text-xs">Unit USD</th>
                  <th className="border border-gray-300 px-1 py-1 text-center text-xs">USD</th>
                  <th className="border border-gray-300 px-1 py-1 text-center text-xs">Total</th>
                </React.Fragment>
              ))}
              <th className="border border-gray-300 px-2 py-1 text-right text-xs">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, itemIdx) => {
              let itemTotal = 0;
              return (
                <tr
                  key={item.itemId}
                  className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-300 px-2 py-1 text-xs font-medium">
                    {item.itemCode}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs">
                    {item.itemName}
                  </td>

                  {crewMembers.map((crew) => {
                    const consumption = item.crewConsumption.find(
                      (c) => c.crewId === crew.id
                    );
                    const qty = consumption?.quantity || 0;
                    const total = consumption?.totalDeduction || 0;
                    itemTotal += total;

                    return (
                      <React.Fragment key={crew.id}>
                        <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                          {qty > 0 ? qty.toFixed(2) : '-'}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                          -
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                          -
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-right text-xs font-semibold">
                          {total > 0 ? `$${total.toFixed(2)}` : '-'}
                        </td>
                      </React.Fragment>
                    );
                  })}

                  <td className="border border-gray-300 px-2 py-1 text-right text-xs font-bold bg-green-50">
                    ${itemTotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-yellow-100 font-bold">
            <tr>
              <td
                colSpan={2}
                className="border border-gray-300 px-2 py-2 text-left text-xs"
              >
                TOTAL PURCHASE
              </td>
              {crewMembers.map((crew) => (
                <React.Fragment key={crew.id}>
                  <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                    {data
                      .reduce((sum, item) => {
                        const consumption = item.crewConsumption.find(
                          (c) => c.crewId === crew.id
                        );
                        return sum + (consumption?.quantity || 0);
                      }, 0)
                      .toFixed(2)}
                  </td>
                  <td colSpan={3} className="border border-gray-300 px-1 py-1"></td>
                  <td className="border border-gray-300 px-1 py-1 text-right text-xs font-bold">
                    $
                    {data
                      .reduce((sum, item) => {
                        const consumption = item.crewConsumption.find(
                          (c) => c.crewId === crew.id
                        );
                        return sum + (consumption?.totalDeduction || 0);
                      }, 0)
                      .toFixed(2)}
                  </td>
                </React.Fragment>
              ))}
              <td className="border border-gray-300 px-2 py-2 text-right text-xs font-bold">
                ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm">Total Items</p>
          <p className="text-2xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-sm">Total Crew</p>
          <p className="text-2xl font-bold text-green-600">{crewMembers.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-gray-600 text-sm">Avg Cost/Crew</p>
          <p className="text-2xl font-bold text-purple-600">
            ${crewMembers.length > 0 ? (totalAmount / crewMembers.length).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-gray-600 text-sm">Grand Total</p>
          <p className="text-2xl font-bold text-orange-600">${totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
