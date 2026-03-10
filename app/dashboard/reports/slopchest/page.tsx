'use client';

import { useState, useRef } from 'react';
import SlopchestItemwiseReport from '@/components/reports/SlopchestItemwiseReport';
import SlopchestCrewwiseReport from '@/components/reports/SlopchestCrewwiseReport';

export default function SlopchestReportsPage() {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [reportType, setReportType] = useState<'itemwise' | 'crewwise'>('itemwise');
    
    const itemwiseRef = useRef<{ handleExportExcel: () => void }>(null);
    const crewwiseRef = useRef<{ handleExportExcel: () => void }>(null);

    const handleExportExcel = () => {
        if (reportType === 'itemwise') {
            itemwiseRef.current?.handleExportExcel();
        } else {
            crewwiseRef.current?.handleExportExcel();
        }
    };

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const monthName = months.find(m => m.value === selectedMonth)?.label || '';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Slopchest Reports</h1>
                <p className="text-gray-600 mt-2">Analyze slopchest consumption by item or by crew member</p>
            </div>

            {/* Controls - Compact Layout */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                {/* First Row: Date Navigation and Selectors */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Date Navigation */}
                    <button
                        onClick={handlePrevMonth}
                        className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition font-medium whitespace-nowrap"
                    >
                        ← Prev
                    </button>
                    
                    <div className="text-center px-2 py-1.5 bg-blue-50 rounded border border-blue-200 min-w-max">
                        <p className="text-sm font-bold text-gray-900">{monthName} {selectedYear}</p>
                    </div>
                    
                    <button
                        onClick={handleNextMonth}
                        className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition font-medium whitespace-nowrap"
                    >
                        Next →
                    </button>

                    {/* Month Selector */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>

                    {/* Year Selector */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    {/* Report Type - Inline Radio Buttons */}
                    <div className="flex items-center gap-4 ml-auto border-l border-gray-300 pl-4">
                        <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                            <input
                                type="radio"
                                name="reportType"
                                value="itemwise"
                                checked={reportType === 'itemwise'}
                                onChange={(e) => setReportType('itemwise')}
                                className="cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">📦 Item-wise</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                            <input
                                type="radio"
                                name="reportType"
                                value="crewwise"
                                checked={reportType === 'crewwise'}
                                onChange={(e) => setReportType('crewwise')}
                                className="cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">👥 Crew-wise</span>
                        </label>

                        {/* Export Button */}
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition whitespace-nowrap ml-2 border-l border-gray-300 pl-4"
                        >
                            <span>📥</span>
                            Export XLS
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            <div>
                {reportType === 'itemwise' ? (
                    <>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Item-wise Consumption Analysis</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Shows consumption details grouped by item. Ordered by highest deduction.
                            </p>
                        </div>
                        <SlopchestItemwiseReport ref={itemwiseRef} month={selectedMonth} year={selectedYear} />
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Crew-wise Expense Summary</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Shows slopchest expenses per crew member. Click View to see item-by-item breakdown.
                            </p>
                        </div>
                        <SlopchestCrewwiseReport ref={crewwiseRef} month={selectedMonth} year={selectedYear} />
                    </>
                )}
            </div>
        </div>
    );
}
