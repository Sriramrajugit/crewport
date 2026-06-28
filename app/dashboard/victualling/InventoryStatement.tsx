'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface ItemInventory {
  itemId: number;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  unitPrice: number;
  openingBalance: number;
  purchaseQuantity: number;
  totalROB: number;
  consumptionQuantity: number;
  closingBalance: number;
  totalAmount: number;
}

interface InventoryTotals {
  totalOpeningBalance: number;
  totalPurchase: number;
  totalROB: number;
  totalConsumption: number;
  totalClosingBalance: number;
  totalAmount: number;
}

interface InventoryStatementProps {
  vesselId: number;
  month: number;
  year: number;
  onBack?: () => void;
}

export default function InventoryStatement({
  vesselId,
  month,
  year,
  onBack
}: InventoryStatementProps) {
  const [items, setItems] = useState<ItemInventory[]>([]);
  const [totals, setTotals] = useState<InventoryTotals>({
    totalOpeningBalance: 0,
    totalPurchase: 0,
    totalROB: 0,
    totalConsumption: 0,
    totalClosingBalance: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [vesselId, month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/victualling/consolidated?vesselId=${vesselId}&month=${month}&year=${year}&format=inventory`
      );
      const result = await response.json();

      if (result.items) {
        setItems(result.items);
        setTotals(result.totals);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (items.length === 0) {
      alert('No data to export');
      return;
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1];

    const ws_data: any[] = [
      [`CONSUMPTION STATEMENT FOR THE MONTH OF ${monthName.toUpperCase()} ${year}`],
      ['(ALL AMOUNTS IN US DOLLARS)'],
      [],
      [
        'ITEM CODE',
        'ITEM NAME',
        'UNIT',
        'UNIT PRICE',
        'OPENING BALANCE',
        'PURCHASE',
        'TOTAL MONTHLY ROB',
        'CONSUMPTION',
        'MONTH-END EOB',
        'TOTAL AMOUNT'
      ]
    ];

    // Add item rows
    items.forEach(item => {
      ws_data.push([
        item.itemCode,
        item.itemName,
        item.unit,
        item.unitPrice.toFixed(2),
        item.openingBalance.toFixed(2),
        item.purchaseQuantity.toFixed(2),
        item.totalROB.toFixed(2),
        item.consumptionQuantity.toFixed(2),
        item.closingBalance.toFixed(2),
        item.totalAmount.toFixed(2)
      ]);
    });

    // Add total row
    ws_data.push([]);
    ws_data.push([
      '',
      'TOTALS',
      '',
      '',
      totals.totalOpeningBalance.toFixed(2),
      totals.totalPurchase.toFixed(2),
      totals.totalROB.toFixed(2),
      totals.totalConsumption.toFixed(2),
      totals.totalClosingBalance.toFixed(2),
      totals.totalAmount.toFixed(2)
    ]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Inventory Statement');
    XLSX.writeFile(workbook, `Inventory_Statement_${monthName}_${year}.xlsx`);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading inventory data...</div>;
  }

  if (items.length === 0) {
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
            CONSUMPTION STATEMENT
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

      {/* Inventory Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg mb-6">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold">ITEM CODE</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold">ITEM NAME</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-bold">UNIT</th>
              <th className="border border-gray-300 px-4 py-2 text-right font-bold">UNIT PRICE</th>
              <th className="border border-gray-300 px-4 py-2 text-right font-bold bg-blue-50">
                OPENING BALANCE
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right font-bold bg-green-50">
                PURCHASE
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right font-bold bg-yellow-50">
                TOTAL MONTHLY ROB
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right font-bold bg-red-50">
                CONSUMPTION
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right font-bold bg-purple-50">
                MONTH-END EOB
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right font-bold">
                TOTAL AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.itemId}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-900">
                  {item.itemCode}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.itemName}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                  {item.unit}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right bg-blue-50">
                  {item.openingBalance.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right bg-green-50">
                  {item.purchaseQuantity.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-semibold bg-yellow-50">
                  {item.totalROB.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-semibold bg-red-50">
                  {item.consumptionQuantity.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-semibold bg-purple-50">
                  {item.closingBalance.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                  ${item.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-yellow-100 font-bold">
            <tr>
              <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">
                TOTALS
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right bg-blue-100">
                {totals.totalOpeningBalance.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right bg-green-100">
                {totals.totalPurchase.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right bg-yellow-100">
                {totals.totalROB.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right bg-red-100">
                {totals.totalConsumption.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right bg-purple-100">
                {totals.totalClosingBalance.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                ${totals.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm">Total Items</p>
          <p className="text-2xl font-bold text-blue-600">{items.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-gray-600 text-sm">Total Consumption</p>
          <p className="text-2xl font-bold text-red-600">{totals.totalConsumption.toFixed(2)}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-gray-600 text-sm">Grand Total Amount</p>
          <p className="text-2xl font-bold text-orange-600">${totals.totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
