'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import InventoryStatement from './InventoryStatement';

interface ConsolidatedItem {
  itemId: number;
  itemName: string;
  category: string;
  unit: string;
  totalQuantity: number;
  unitPrice: number;
  totalAmount: number;
  crewAffected: number;
}

interface ConsolidatedTotals {
  totalQuantity: number;
  totalAmount: number;
  itemCount: number;
  crewCount: number;
  avgCostPerCrew: number;
}

interface ConsolidatedSheetProps {
  vesselId: number;
  month: number;
  year: number;
}

export default function ConsolidatedSheet({ vesselId, month, year }: ConsolidatedSheetProps) {
  const [data, setData] = useState<ConsolidatedItem[]>([]);
  const [totals, setTotals] = useState<ConsolidatedTotals>({
    totalQuantity: 0,
    totalAmount: 0,
    itemCount: 0,
    crewCount: 0,
    avgCostPerCrew: 0
  });
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<'category' | 'item'>('category');
  const [viewType, setViewType] = useState<'inventory' | 'simple' | 'crew'>('inventory');

  useEffect(() => {
    fetchData();
  }, [vesselId, month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/victualling/consolidated?vesselId=${vesselId}&month=${month}&year=${year}`
      );
      const result = await response.json();
      
      if (result.data) {
        setData(result.data);
        setTotals(result.totals);
      }
    } catch (error) {
      console.error('Error fetching consolidated data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[month - 1];
    
    const exportData = [
      [`Consolidated Victualling Summary - ${monthName} ${year}`],
      [],
      ['Item Name', 'Category', 'Unit', 'Total Quantity', 'Unit Price', 'Total Amount', 'Crew Affected'],
      ...data.map(row => [
        row.itemName,
        row.category,
        row.unit,
        row.totalQuantity,
        row.unitPrice,
        row.totalAmount,
        row.crewAffected
      ]),
      [],
      ['', '', 'TOTALS:', totals.itemCount, '', totals.totalAmount]
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Consolidated');
    XLSX.writeFile(workbook, `Consolidated_Summary_${monthName}_${year}.xlsx`);
  };

  const groupedData = groupBy === 'category' 
    ? data.reduce((acc: any, item) => {
        const existing = acc.find((g: any) => g.category === item.category);
        if (existing) {
          existing.items.push(item);
          existing.categoryTotal += item.totalAmount;
          existing.categoryQuantity += item.totalQuantity;
        } else {
          acc.push({
            category: item.category,
            items: [item],
            categoryTotal: item.totalAmount,
            categoryQuantity: item.totalQuantity
          });
        }
        return acc;
      }, [])
    : data.map(item => ({ category: null, items: [item], categoryTotal: item.totalAmount, categoryQuantity: item.totalQuantity }));

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading consolidated data...</div>;
  }

  if (viewType === 'inventory') {
    return (
      <InventoryStatement
        vesselId={vesselId}
        month={month}
        year={year}
        onBack={() => setViewType('simple')}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Consolidated Victualling Summary</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('inventory')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            📋 Inventory Statement
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
          >
            📊 Export to Excel
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 mr-4">Group By:</label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="category">Category</option>
          <option value="item">Item</option>
        </select>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No consumption data available for this period</p>
        </div>
      ) : (
        <>
          {/* Grouped Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Unit</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Crew Affected</th>
                </tr>
              </thead>
              <tbody>
                {groupedData.map((group: any, groupIdx: number) => (
                  <React.Fragment key={groupIdx}>
                    {group.items.map((row: ConsolidatedItem, itemIdx: number) => (
                      <tr
                        key={`${groupIdx}-${itemIdx}`}
                        className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="border border-gray-300 px-4 py-2">{row.itemName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{row.category}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-sm">{row.unit}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{row.totalQuantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$ {row.unitPrice.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-semibold">$ {row.totalAmount.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{row.crewAffected}</td>
                      </tr>
                    ))}
                    {groupBy === 'category' && (
                      <tr className="bg-yellow-50 font-bold">
                        <td colSpan={3} className="border border-gray-300 px-4 py-2">{group.category} Subtotal</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{group.categoryQuantity}</td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                        <td className="border border-gray-300 px-4 py-2 text-right">$ {group.categoryTotal.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-yellow-100 font-bold">
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">TOTALS:</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{totals.totalQuantity}</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2 text-right">$ {totals.totalAmount.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-2xl font-bold text-blue-600">{totals.itemCount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-600 text-sm">Total Quantity</p>
              <p className="text-2xl font-bold text-green-600">{totals.totalQuantity}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-gray-600 text-sm">Avg Cost/Crew</p>
              <p className="text-2xl font-bold text-purple-600">$ {totals.avgCostPerCrew.toFixed(2)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-orange-600">$ {totals.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
