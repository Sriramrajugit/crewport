'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface OnSignerRecord {
  id: number;
  rank: string;
  fromDate: string;
  toDate: string;
  noOfPersons: number;
  noOfDays: number;
  numberOfMeals: number;
  totalManDays: number;
  totalMealsValue: number;
  usdValue: number;
  exchangeRate: number;
}

interface OutPortExpense {
  id: number;
  description: string;
  fromDate: string;
  toDate: string;
  noOfPersons: number;
  noOfDays: number;
  numberOfMeals: number;
  totalManDays: number;
  totalMealsValue: number;
  usdValue: number;
  exchangeRate: number;
}

interface OutportMessingSheetProps {
  vesselId: number;
  month: number;
  year: number;
}

export default function OutportMessingSheet({ vesselId, month, year }: OutportMessingSheetProps) {
  const [onSigners, setOnSigners] = useState<OnSignerRecord[]>([]);
  const [outPortExpenses, setOutPortExpenses] = useState<OutPortExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number>(83.5);
  const [mealCost, setMealCost] = useState<number>(500);


  useEffect(() => {
    fetchData();
  }, [vesselId, month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch on-signers crew
      const response = await fetch(
        `/api/crew?vesselId=${vesselId}&status=ON_SIGNER&month=${month}&year=${year}`
      );
      if (response.ok) {
        const crewData = await response.json();
        const signers = crewData.map((crew: any, idx: number) => ({
          id: idx + 1,
          rank: crew.rank || 'N/A',
          fromDate: crew.sign_on_date ? new Date(crew.sign_on_date).toISOString().split('T')[0] : '',
          toDate: crew.sign_off_date ? new Date(crew.sign_off_date).toISOString().split('T')[0] : '',
          noOfPersons: 1,
          noOfDays: 1,
          numberOfMeals: 0, // To be manually entered
          totalManDays: 1,
          totalMealsValue: 0,
          usdValue: 0,
          exchangeRate: exchangeRate
        }));
        setOnSigners(signers);
      }
    } catch (error) {
      console.error('Error fetching outport data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOnSigner = (id: number, field: string, value: any) => {
    const updated = onSigners.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        // Auto-calculate noOfDays when toDate changes
        if (field === 'toDate') {
          newRow.noOfDays = calculateDaysBetweenDates(newRow.fromDate, value);
        }
        if (field === 'fromDate' && newRow.toDate) {
          newRow.noOfDays = calculateDaysBetweenDates(value, newRow.toDate);
        }
        // Recalculate totals
        if (field === 'noOfPersons' || field === 'noOfDays' || field === 'toDate' || field === 'fromDate') {
          newRow.totalManDays = newRow.noOfPersons * newRow.noOfDays;
          newRow.totalMealsValue = newRow.totalManDays * mealCost;
          newRow.usdValue = newRow.totalMealsValue / exchangeRate;
        }
        return newRow;
      }
      return row;
    });
    setOnSigners(updated);
  };

  const updateOutPortExpense = (id: number, field: string, value: any) => {
    const updated = outPortExpenses.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        // Auto-calculate noOfDays when toDate changes
        if (field === 'toDate') {
          newRow.noOfDays = calculateDaysBetweenDates(newRow.fromDate, value);
        }
        if (field === 'fromDate' && newRow.toDate) {
          newRow.noOfDays = calculateDaysBetweenDates(value, newRow.toDate);
        }
        // Recalculate totals
        if (field === 'noOfPersons' || field === 'noOfDays' || field === 'toDate' || field === 'fromDate') {
          newRow.totalManDays = newRow.noOfPersons * newRow.noOfDays;
          newRow.totalMealsValue = newRow.totalManDays * mealCost;
          newRow.usdValue = newRow.totalMealsValue / exchangeRate;
        }
        return newRow;
      }
      return row;
    });
    setOutPortExpenses(updated);
  };

  const addOutPortExpense = () => {
    const newExpense: OutPortExpense = {
      id: (outPortExpenses.length > 0 ? Math.max(...outPortExpenses.map(e => e.id)) : 0) + 1,
      description: '',
      fromDate: '',
      toDate: '',
      noOfPersons: 0,
      noOfDays: 0,
      numberOfMeals: 0,
      totalManDays: 0,
      totalMealsValue: 0,
      usdValue: 0,
      exchangeRate: exchangeRate
    };
    setOutPortExpenses([...outPortExpenses, newExpense]);
  };

  const deleteOutPortExpense = (id: number) => {
    setOutPortExpenses(outPortExpenses.filter(e => e.id !== id));
  };

  const calculateDaysBetweenDates = (fromDate: string, toDate: string): number => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays > 0 ? diffDays : 0;
  };

  const totalOnSignersManDays = onSigners.reduce((sum, row) => sum + row.totalManDays, 0);
  const totalOutPortManDays = outPortExpenses.reduce((sum, row) => sum + row.totalManDays, 0);
  const grandTotalManDays = totalOnSignersManDays + totalOutPortManDays;

  const exportToExcel = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[month - 1];
    
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: On Signers
    const onSignersData = [
      ['STATEMENT OF MAN DAYS'],
      ['OUTPORT MESSING'],
      [`${monthName}-${year.toString().slice(-2)}`],
      [],
      ['Ranks', 'From', 'To', 'No. of persons', 'No. of days', 'Total Man days', 'USD'],
      ...onSigners.map(row => [
        row.rank,
        row.fromDate,
        row.toDate,
        row.noOfPersons,
        row.noOfDays,
        row.totalManDays,
        row.usdValue.toFixed(2)
      ]),
      [],
      ['', '', '', '', '', 'Total Mandays:', totalOnSignersManDays]
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(onSignersData);
    XLSX.utils.book_append_sheet(wb, ws1, 'On Signers');

    // Sheet 2: Out Port Expenses
    const outPortData = [
      ['OUT PORT EXPENSES'],
      [],
      ['Description', 'From', 'To', 'No. of persons', 'No. of days', 'Total Man days', 'USD'],
      ...outPortExpenses.map(row => [
        row.description,
        row.fromDate,
        row.toDate,
        row.noOfPersons,
        row.noOfDays,
        row.totalManDays,
        row.usdValue.toFixed(2)
      ]),
      [],
      ['', '', '', '', '', 'Total Mandays:', totalOutPortManDays]
    ];

    const ws2 = XLSX.utils.aoa_to_sheet(outPortData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Out Port Expenses');

    XLSX.writeFile(wb, `Outport_Messing_${monthName}_${year}.xlsx`);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading outport messing data...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Outport Messing Statement</h2>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
        >
          📊 Export to Excel
        </button>
      </div>

      {/* Exchange Rate & Meal Cost Settings */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Exchange Rate (INR/USD)</label>
          <input
            type="number"
            step="0.01"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 83.5)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Cost ($)</label>
          <input
            type="number"
            step="0.01"
            value={mealCost}
            onChange={(e) => setMealCost(parseFloat(e.target.value) || 500)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* On Signers Section */}
      <div>
        <div className="bg-gray-200 p-3 mb-4 rounded font-bold">
          STATEMENT OF MAN DAYS - ON SIGNERS
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left">Ranks</th>
                <th className="border border-gray-300 px-3 py-2 text-left">From</th>
                <th className="border border-gray-300 px-3 py-2 text-left">To</th>
                <th className="border border-gray-300 px-3 py-2 text-center">No. of persons</th>
                <th className="border border-gray-300 px-3 py-2 text-center">No. of days</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Total Man days</th>
                <th className="border border-gray-300 px-3 py-2 text-right">USD</th>
              </tr>
            </thead>
            <tbody>
              {onSigners.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-3 py-2">{row.rank}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="date"
                      value={row.fromDate}
                      onChange={(e) => updateOnSigner(row.id, 'fromDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="date"
                      value={row.toDate}
                      onChange={(e) => updateOnSigner(row.id, 'toDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <input
                      type="number"
                      value={row.noOfPersons}
                      onChange={(e) => updateOnSigner(row.id, 'noOfPersons', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold">{row.noOfDays}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold">{row.totalManDays}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-semibold">$ {row.usdValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-yellow-100 font-bold">
              <tr>
                <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right">Total Mandays:</td>
                <td className="border border-gray-300 px-3 py-2 text-center"></td>
                <td className="border border-gray-300 px-3 py-2 text-center">{totalOnSignersManDays}</td>
                <td className="border border-gray-300 px-3 py-2 text-right">$ {(totalOnSignersManDays * mealCost / exchangeRate).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Out Port Expenses Section */}
      <div>
        <div className="bg-gray-200 p-3 mb-4 rounded font-bold">
          OUT PORT EXPENSES
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-3 py-2 text-left">From</th>
                <th className="border border-gray-300 px-3 py-2 text-left">To</th>
                <th className="border border-gray-300 px-3 py-2 text-center">No. of persons</th>
                <th className="border border-gray-300 px-3 py-2 text-center">No. of days</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Total Man days</th>
                <th className="border border-gray-300 px-3 py-2 text-right">USD</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {outPortExpenses.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => updateOutPortExpense(row.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="date"
                      value={row.fromDate}
                      onChange={(e) => updateOutPortExpense(row.id, 'fromDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="date"
                      value={row.toDate}
                      onChange={(e) => updateOutPortExpense(row.id, 'toDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <input
                      type="number"
                      value={row.noOfPersons}
                      onChange={(e) => updateOutPortExpense(row.id, 'noOfPersons', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold">{row.noOfDays}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold">{row.totalManDays}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-semibold">$ {row.usdValue.toFixed(2)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      onClick={() => deleteOutPortExpense(row.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-yellow-100 font-bold">
              <tr>
                <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right">Total Mandays:</td>
                <td className="border border-gray-300 px-3 py-2 text-center"></td>
                <td className="border border-gray-300 px-3 py-2 text-center">{totalOutPortManDays}</td>
                <td className="border border-gray-300 px-3 py-2 text-right">$ {(totalOutPortManDays * mealCost / exchangeRate).toFixed(2)}</td>
                <td className="border border-gray-300 px-3 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <button
          onClick={addOutPortExpense}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
        >
          + Add Expense
        </button>
      </div>

      {/* Grand Total */}
      <div className="bg-gradient-to-r from-green-100 to-yellow-100 p-4 rounded-lg border-2 border-green-400">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 text-sm">On Signers Mandays</p>
            <p className="text-2xl font-bold text-green-600">{totalOnSignersManDays}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Out Port Expenses Mandays</p>
            <p className="text-2xl font-bold text-blue-600">{totalOutPortManDays}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Grand Total Mandays</p>
            <p className="text-3xl font-bold text-purple-600">{grandTotalManDays}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
