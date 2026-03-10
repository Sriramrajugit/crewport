'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useVessel } from '@/app/context/VesselContext';
import * as XLSX from 'xlsx';

interface CrewConsumption {
    crew_member_id: number;
    crew_name: string;
    rank: string;
    consumption_date: string;
    item_code: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_deduction: number;
    notes: string;
}

interface Props {
    month: number;
    year: number;
}

const SlopchestCrewwiseReport = forwardRef<{ handleExportExcel: () => void }, Props>(
    ({ month, year }, ref) => {
        const { selectedVessel } = useVessel();
        const [consumptions, setConsumptions] = useState<CrewConsumption[]>([]);
        const [loading, setLoading] = useState(true);

        // Setup imperative handle with the export function defined inside
        useImperativeHandle(ref, () => ({
            handleExportExcel: () => {
                const crewSummary = new Map<number, { rank: string; name: string; total: number; itemCount: number }>();
                consumptions.forEach(c => {
                    if (!crewSummary.has(c.crew_member_id)) {
                        crewSummary.set(c.crew_member_id, { rank: c.rank, name: c.crew_name, total: c.total_deduction, itemCount: 1 });
                    } else {
                        const existing = crewSummary.get(c.crew_member_id)!;
                        existing.total += c.total_deduction;
                        existing.itemCount += 1;
                    }
                });

                const grandTotal = consumptions.reduce((sum, c) => sum + c.total_deduction, 0);

                try {
                    const workbook = XLSX.utils.book_new();

                    // Summary Sheet
                    const summaryData = [
                        ['CREW-WISE SLOPCHEST SUMMARY'],
                        [],
                        ['Rank', 'Crew Name', 'Item Count', 'Total Deduction'],
                        ...Array.from(crewSummary.values()).map(crew => [
                            crew.rank,
                            crew.name,
                            crew.itemCount,
                            crew.total
                        ]),
                        [],
                        ['', 'TOTAL', consumptions.length, grandTotal]
                    ];

                    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
                    summarySheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 18 }];
                    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

                    // Details Sheet
                    const detailsData = [
                        ['SLOPCHEST CONSUMPTION DETAILS'],
                        [],
                        ['Rank', 'Crew Name', 'Date', 'Item Code', 'Item Name', 'Qty', 'Rate', 'Total', 'Notes'],
                        ...consumptions.map(item => [
                            item.rank,
                            item.crew_name,
                            new Date(item.consumption_date).toLocaleDateString('en-IN'),
                            item.item_code,
                            item.item_name,
                            item.quantity,
                            item.unit_price,
                            item.total_deduction,
                            item.notes
                        ]),
                        [],
                        ['', '', '', '', 'GRAND TOTAL', '', '', grandTotal, '']
                    ];

                    const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData);
                    detailsSheet['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 25 }];
                    XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Details');

                    // Generate filename
                    const monthName = new Date(2026, month - 1).toLocaleString('en-IN', { month: 'long' });
                    const filename = `Slopchest_Crewwise_${monthName}_${year}.xlsx`;

                    XLSX.writeFile(workbook, filename);
                } catch (error) {
                    console.error('Error exporting to Excel:', error);
                    alert('Failed to export Excel file');
                }
            }
        }));

        // Then useEffect and other hooks
        useEffect(() => {
            if (selectedVessel && month && year) {
                fetchCrewReport();
            }
        }, [selectedVessel, month, year]);

    const fetchCrewReport = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/slopchest/consumption?month=${month}&year=${year}`,
                {
                    headers: {
                        'X-Vessel-Id': selectedVessel?.vessel_id.toString() || ''
                    }
                }
            );

            if (response.ok) {
                const consumptions = await response.json();
                
                // Transform and sort by crew name, then date
                const transformed = consumptions.map((c: any) => ({
                    crew_member_id: c.crew_member_id,
                    crew_name: c.crew_members.name,
                    rank: c.crew_members.rank,
                    consumption_date: c.consumption_date,
                    item_code: c.slopchest_items.item_code,
                    item_name: c.slopchest_items.item_name,
                    quantity: parseFloat(c.quantity.toString()),
                    unit_price: parseFloat(c.unit_price.toString()),
                    total_deduction: parseFloat(c.total_deduction.toString()),
                    notes: c.notes || ''
                })).sort((a: CrewConsumption, b: CrewConsumption) => {
                    if (a.crew_name !== b.crew_name) {
                        return a.crew_name.localeCompare(b.crew_name);
                    }
                    return new Date(a.consumption_date).getTime() - new Date(b.consumption_date).getTime();
                });

                setConsumptions(transformed);
            }
        } catch (err) {
            console.error('Error fetching crew report:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading report...</div>;
    }

    if (consumptions.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <p className="text-center text-gray-600">No slopchest consumption data for this period</p>
            </div>
        );
    }

    // Calculate summary by crew
    const crewSummary = new Map<number, { rank: string; name: string; total: number; itemCount: number }>();
    consumptions.forEach(c => {
        if (!crewSummary.has(c.crew_member_id)) {
            crewSummary.set(c.crew_member_id, { rank: c.rank, name: c.crew_name, total: c.total_deduction, itemCount: 1 });
        } else {
            const existing = crewSummary.get(c.crew_member_id)!;
            existing.total += c.total_deduction;
            existing.itemCount += 1;
        }
    });

    const grandTotal = consumptions.reduce((sum, c) => sum + c.total_deduction, 0);

    return (
        <div className="space-y-4">
            {/* Summary Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 px-6 py-3">
                    <h3 className="text-white font-bold">Crew Summary</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="px-6 py-3 text-left font-semibold text-gray-800">Rank</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-800">Crew Name</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-800">Item Count</th>
                                <th className="px-6 py-3 text-right font-semibold text-gray-800">Total Deduction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Array.from(crewSummary.values()).map((crew, index) => (
                                <tr 
                                    key={index}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    <td className="px-6 py-3 font-medium text-gray-900">{crew.rank}</td>
                                    <td className="px-6 py-3 text-gray-700">{crew.name}</td>
                                    <td className="px-6 py-3 text-center text-gray-700">{crew.itemCount}</td>
                                    <td className="px-6 py-3 text-right font-bold text-gray-900">
                                        ₹{crew.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-blue-50 border-t-2 border-blue-300 font-bold">
                                <td colSpan={2} className="px-6 py-3 text-right text-gray-900">
                                    TOTAL
                                </td>
                                <td className="px-6 py-3 text-center text-blue-600">
                                    {consumptions.length}
                                </td>
                                <td className="px-6 py-3 text-right text-blue-600">
                                    ₹{grandTotal.toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Detailed Consumption Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-green-600 px-6 py-3">
                    <h3 className="text-white font-bold">Item-wise Consumption Details</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Rank</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Crew Name</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Item Code</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Item Name</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-700">Qty</th>
                                <th className="px-6 py-3 text-right font-semibold text-gray-700">Rate</th>
                                <th className="px-6 py-3 text-right font-semibold text-gray-700">Total</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {consumptions.map((item, index) => (
                                <tr 
                                    key={index}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    <td className="px-6 py-3 font-medium text-gray-900">{item.rank}</td>
                                    <td className="px-6 py-3 text-gray-700">{item.crew_name}</td>
                                    <td className="px-6 py-3 text-gray-700">
                                        {new Date(item.consumption_date).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{item.item_code}</td>
                                    <td className="px-6 py-3 text-gray-700">{item.item_name}</td>
                                    <td className="px-6 py-3 text-center text-gray-700">{item.quantity}</td>
                                    <td className="px-6 py-3 text-right text-gray-700">
                                        ₹{item.unit_price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-gray-900">
                                        ₹{item.total_deduction.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-gray-600 text-xs max-w-xs truncate">
                                        {item.notes || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-green-50 border-t-2 border-green-300 font-bold">
                                <td colSpan={7} className="px-6 py-3 text-right text-gray-900">
                                    GRAND TOTAL
                                </td>
                                <td className="px-6 py-3 text-right text-green-600">
                                    ₹{grandTotal.toFixed(2)}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
    }
);

SlopchestCrewwiseReport.displayName = 'SlopchestCrewwiseReport';
export default SlopchestCrewwiseReport;
