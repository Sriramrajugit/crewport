'use client';

import { useState, useRef } from 'react';
import { useVessel } from '@/app/context/VesselContext';
import HRAReport from '@/components/reports/HRAReport';

export default function HRAReportPage() {
    const { selectedVessel } = useVessel();
    const [selectedMonth, setSelectedMonth] = useState<string>(
        new Date().toISOString().split('T')[0].substring(0, 7) // YYYY-MM format
    );
    const reportRef = useRef<{ handleExportExcel: () => void }>(null);

    const [year, month] = selectedMonth.split('-').map(Number);

    const handleExportClick = () => {
        reportRef.current?.handleExportExcel();
    };

    const handlePreviousMonth = () => {
        const [y, m] = selectedMonth.split('-').map(Number);
        let newMonth = m - 1;
        let newYear = y;
        if (newMonth === 0) {
            newMonth = 12;
            newYear--;
        }
        setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
    };

    const handleNextMonth = () => {
        const [y, m] = selectedMonth.split('-').map(Number);
        let newMonth = m + 1;
        let newYear = y;
        if (newMonth === 13) {
            newMonth = 1;
            newYear++;
        }
        setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
    };

    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                    <span>⚠️</span>
                    HRA - High Risk Area Report
                </h1>
                <p className="text-gray-600">
                    Detailed report of High Risk Area entries grouped by employee and date range
                </p>
            </div>

            {!selectedVessel ? (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <p className="text-yellow-800 font-medium">⚠️ Please select a vessel from the context menu</p>
                </div>
            ) : (
                <>
                    {/* Filter Section */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Month
                                </label>
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={handlePreviousMonth}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                    >
                                        ← Previous
                                    </button>
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleNextMonth}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                                {monthName}
                            </div>
                        </div>

                        {/* Vessel Info */}
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-600">
                                Vessel: <span className="font-bold text-gray-900">{selectedVessel.vessel_name}</span>
                            </p>
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleExportClick}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 shadow"
                        >
                            📥 Download Excel Report
                        </button>
                    </div>

                    {/* Report Component */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <HRAReport ref={reportRef} month={month} year={year} />
                    </div>
                </>
            )}
        </div>
    );
}
