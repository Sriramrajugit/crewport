'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface CrewManday {
  crewMemberId: number;
  crewName: string;
  rank: string;
  signOnDate: string;
  signOffDate: string | null;
  mandaysInMonth: number;
  numberOfMeals: number;
}

interface ShipstaffMandaySheetProps {
  vesselId: number;
  month: number;
  year: number;
}

export default function ShipstaffMandaySheet({ vesselId, month, year }: ShipstaffMandaySheetProps) {
  const [data, setData] = useState<CrewManday[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalMandays: 0,
    totalMeals: 0,
    crewCount: 0
  });

  useEffect(() => {
    fetchData();
  }, [vesselId, month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/victualling/manday?vesselId=${vesselId}&month=${month}&year=${year}`
      );
      const result = await response.json();
      
      if (result.data) {
        setData(result.data);
        setTotals(result.totals);
      }
    } catch (error) {
      console.error('Error fetching manday data:', error);
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
      [`Shipstaff Manday Calculation Sheet - ${monthName} ${year}`],
      [],
      ['Crew Name', 'Rank', 'Sign On Date', 'Sign Off Date', 'Man-Days', 'Number of Meals'],
      ...data.map(row => [
        row.crewName,
        row.rank,
        row.signOnDate,
        row.signOffDate || 'N/A',
        row.mandaysInMonth,
        row.numberOfMeals
      ]),
      [],
      ['TOTALS', '', '', '', totals.totalMandays, totals.totalMeals]
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Manday');
    XLSX.writeFile(workbook, `Shipstaff_Manday_${monthName}_${year}.xlsx`);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading manday calculation data...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Shipstaff Manday Calculation</h2>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
        >
          📊 Export to Excel
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No crew data available for this period</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Crew Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Sign On</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Sign Off</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Man-Days</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Number of Meals</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2">{row.crewName}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.rank}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.signOnDate}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.signOffDate || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{row.mandaysInMonth}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{row.numberOfMeals}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-yellow-100 font-bold">
                <tr>
                  <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">TOTALS:</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalMandays}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalMeals}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-600 text-sm">Total Crew</p>
              <p className="text-2xl font-bold text-blue-600">{totals.crewCount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-600 text-sm">Total Man-Days</p>
              <p className="text-2xl font-bold text-green-600">{totals.totalMandays}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-gray-600 text-sm">Total Meals</p>
              <p className="text-2xl font-bold text-orange-600">{totals.totalMeals}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
