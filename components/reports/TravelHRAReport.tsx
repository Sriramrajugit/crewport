'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useVessel } from '@/app/context/VesselContext';
import * as XLSX from 'xlsx';

interface ReportEntry {
    type: 'HRA' | 'TRAVEL_WAGES';
    crew_member_id: number;
    crew_name: string;
    rank: string;
    start_date: string;
    end_date: string;
    days: number;
    amount: number;
    entry_id: number;
}

interface Props {
    month: number;
    year: number;
}

const TravelHRAReport = forwardRef<{ handleExportExcel: () => void }, Props>(
    ({ month, year }, ref) => {
        const { selectedVessel } = useVessel();
        const [entries, setEntries] = useState<ReportEntry[]>([]);
        const [loading, setLoading] = useState(true);
        const [summary, setSummary] = useState({
            total_hra_entries: 0,
            total_travel_entries: 0,
            total_hra_amount: 0,
            total_travel_amount: 0
        });

        useEffect(() => {
            fetchReportData();
        }, [selectedVessel, month, year]);

        const fetchReportData = async () => {
            if (!selectedVessel) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `/api/reports/travel-hra?vesselId=${selectedVessel.vessel_id}&month=${month}&year=${year}`,
                    {
                        headers: {
                            'X-Vessel-Id': selectedVessel.vessel_id.toString()
                        }
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch report data');

                const data = await response.json();
                setEntries(data.entries || []);
                setSummary(data.summary);
            } catch (error) {
                console.error('Error fetching report data:', error);
                alert('Failed to load report data');
            } finally {
                setLoading(false);
            }
        };

        // Setup imperative handle with the export function
        useImperativeHandle(ref, () => ({
            handleExportExcel: () => {
                try {
                    const workbook = XLSX.utils.book_new();

                    // Prepare data for export
                    const exportData = entries.map(entry => ({
                        'Type': entry.type === 'HRA' ? 'HRA' : 'Travel Wages',
                        'Employee Name': entry.crew_name,
                        'Rank': entry.rank,
                        'Start Date': new Date(entry.start_date).toLocaleDateString(),
                        'End Date': new Date(entry.end_date).toLocaleDateString(),
                        'No. of Days': entry.days,
                        'Amount': entry.amount.toFixed(2)
                    }));

                    // Add summary row
                    exportData.push({
                        'Type': '',
                        'Employee Name': '',
                        'Rank': '',
                        'Start Date': '',
                        'End Date': 'TOTAL',
                        'No. of Days': entries.reduce((sum, e) => sum + e.days, 0),
                        'Amount': entries.reduce((sum, e) => sum + e.amount, 0).toFixed(2)
                    });

                    // Create worksheet
                    const worksheet = XLSX.utils.json_to_sheet(exportData);
                    
                    // Set column widths
                    const colWidths = [
                        { wch: 15 },  // Type
                        { wch: 20 },  // Employee Name
                        { wch: 15 },  // Rank
                        { wch: 12 },  // Start Date
                        { wch: 12 },  // End Date
                        { wch: 12 },  // No. of Days
                        { wch: 15 }   // Amount
                    ];
                    worksheet['!cols'] = colWidths;

                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Travel & HRA');

                    // Generate filename with month/year
                    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    const filename = `Travel_HRA_Report_${monthName}.xlsx`;

                    XLSX.writeFile(workbook, filename);
                } catch (error) {
                    console.error('Export error:', error);
                    alert('Failed to export Excel file');
                }
            }
        }));

        const getTypeColor = (type: string) => {
            return type === 'HRA' ? 'bg-blue-50' : 'bg-green-50';
        };

        const getTypeBadgeColor = (type: string) => {
            return type === 'HRA' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
        };

        if (loading) {
            return <div className="text-center py-6 text-gray-500">Loading report data...</div>;
        }

        if (entries.length === 0) {
            return (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
                    <p className="text-gray-600">No Travel Wages or HRA entries found for {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
            );
        }

        // Group by crew member
        const groupedByCrew = entries.reduce((acc, entry) => {
            const key = entry.crew_member_id;
            if (!acc[key]) {
                acc[key] = {
                    crew_name: entry.crew_name,
                    rank: entry.rank,
                    entries: []
                };
            }
            acc[key].entries.push(entry);
            return acc;
        }, {} as Record<number, { crew_name: string; rank: string; entries: ReportEntry[] }>);

        return (
            <div className="space-y-6">
                {/* Summary Card */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600">HRA Entries</p>
                        <p className="text-2xl font-bold text-blue-600">{summary.total_hra_entries}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600">Travel Entries</p>
                        <p className="text-2xl font-bold text-green-600">{summary.total_travel_entries}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600">Total HRA</p>
                        <p className="text-2xl font-bold text-blue-600">${summary.total_hra_amount.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600">Total Travel</p>
                        <p className="text-2xl font-bold text-green-600">${summary.total_travel_amount.toFixed(2)}</p>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Employee Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Start Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">End Date</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">No. of Days</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {entries.map((entry, idx) => (
                                    <tr key={idx} className={`hover:bg-gray-50 ${getTypeColor(entry.type)}`}>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(entry.type)}`}>
                                                {entry.type === 'HRA' ? 'HRA' : 'Travel'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{entry.crew_name}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{entry.rank}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{new Date(entry.start_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{new Date(entry.end_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-sm text-center font-medium text-gray-900">{entry.days}</td>
                                        <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">${entry.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                                    <td colSpan={5} className="px-6 py-3 text-right text-sm">TOTAL:</td>
                                    <td className="px-6 py-3 text-sm text-center">{entries.reduce((sum, e) => sum + e.days, 0)}</td>
                                    <td className="px-6 py-3 text-sm text-right">${entries.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Grouped View */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Grouped by Employee</h3>
                    {Object.entries(groupedByCrew).map(([crewId, crewData]) => {
                        const crewTotal = crewData.entries.reduce((sum, e) => sum + e.amount, 0);
                        const crewDays = crewData.entries.reduce((sum, e) => sum + e.days, 0);
                        return (
                            <div key={crewId} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow">
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200">
                                    <p className="font-bold text-gray-900">{crewData.crew_name}</p>
                                    <p className="text-sm text-gray-600">{crewData.rank}</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700">Type</th>
                                                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700">Period</th>
                                                <th className="px-6 py-2 text-center text-xs font-semibold text-gray-700">Days</th>
                                                <th className="px-6 py-2 text-right text-xs font-semibold text-gray-700">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {crewData.entries.map((entry, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-2">
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getTypeBadgeColor(entry.type)}`}>
                                                            {entry.type === 'HRA' ? 'HRA' : 'Travel'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-2 text-gray-600">
                                                        {new Date(entry.start_date).toLocaleDateString()} - {new Date(entry.end_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-2 text-center">{entry.days}</td>
                                                    <td className="px-6 py-2 font-semibold text-right">${entry.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50 font-bold border-t border-gray-300">
                                                <td colSpan={2} className="px-6 py-2 text-right">Subtotal:</td>
                                                <td className="px-6 py-2 text-center">{crewDays}</td>
                                                <td className="px-6 py-2 text-right">${crewTotal.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
);

TravelHRAReport.displayName = 'TravelHRAReport';

export default TravelHRAReport;
