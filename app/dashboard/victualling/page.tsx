'use client';

import React, { useState } from 'react';
import { useVessel } from '@/app/context/VesselContext';
import ShipstaffMandaySheet from './ShipstaffMandaySheet';
import ConsolidatedSheet from './ConsolidatedSheet';
import OutportMessingSheet from './OutportMessingSheet';

export default function VictualsPage() {
  const { selectedVessel } = useVessel();
  const [activeTab, setActiveTab] = useState<'manday' | 'consolidated' | 'outport'>('manday');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getMonthName = (month: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  const tabs = [
    { id: 'manday', label: '📊 Shipstaff Manday Calculation' },
    { id: 'consolidated', label: '📈 Consolidated Summary' },
    { id: 'outport', label: '🚢 Outport Messing' }
  ];

  if (!selectedVessel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 text-lg">Please select a vessel from the dashboard menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Victualling Management - {selectedVessel.vessel_name}
        </h1>
        <p className="text-gray-600">{selectedVessel.company_name}</p>
      </div>

      {/* Month & Year Selector */}
      <div className="mb-6 flex gap-4 items-center">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
              <option key={month} value={month}>{getMonthName(month)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="pt-6">
          <span className="text-lg font-semibold text-gray-700">
            {getMonthName(selectedMonth)} {selectedYear}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-300">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'manday' && (
          <ShipstaffMandaySheet
            vesselId={selectedVessel.vessel_id}
            month={selectedMonth}
            year={selectedYear}
          />
        )}
        {activeTab === 'consolidated' && (
          <ConsolidatedSheet
            vesselId={selectedVessel.vessel_id}
            month={selectedMonth}
            year={selectedYear}
          />
        )}
        {activeTab === 'outport' && (
          <OutportMessingSheet
            vesselId={selectedVessel.vessel_id}
            month={selectedMonth}
            year={selectedYear}
          />
        )}
      </div>
    </div>
  );
}
