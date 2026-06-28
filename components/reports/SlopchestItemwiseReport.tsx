'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useVessel } from '@/app/context/VesselContext';
import * as XLSX from 'xlsx';

interface ItemReport {
    item_id: number;
    item_code: string;
    item_name: string;
    category: string | null;
    unit_price: number;
    total_quantity: number;
    total_deduction: number;
    crew_count: number;
}

interface Props {
    month: number;
    year: number;
}

const SlopchestItemwiseReport = forwardRef<{ handleExportExcel: () => void }, Props>(
    ({ month, year }, ref) => {
        const { selectedVessel } = useVessel();
        const [itemData, setItemData] = useState<ItemReport[]>([]);
        const [loading, setLoading] = useState(true);

        // Setup imperative handle with the export function defined inside
        useImperativeHandle(ref, () => ({
            handleExportExcel: () => {
                const totalValue = itemData.reduce((sum, item) => sum + item.total_deduction, 0);
                const totalQty = itemData.reduce((sum, item) => sum + item.total_quantity, 0);
                
                try {
                    const workbook = XLSX.utils.book_new();

                    // Item-wise Report Sheet
                    const itemData_export = [
                        ['ITEM-WISE SLOPCHEST REPORT'],
                        [],
                        ['Item Code', 'Item Name', 'Category', 'Unit Price', 'Total Qty', 'Crew Count', 'Total Deduction'],
                        ...itemData.map(item => [
                            item.item_code,
                            item.item_name,
                            item.category,
                            item.unit_price,
                            item.total_quantity,
                            item.crew_count,
                            item.total_deduction
                        ]),
                        [],
                        ['', '', '', '', totalQty, itemData.length, totalValue]
                    ];

                    const sheet = XLSX.utils.aoa_to_sheet(itemData_export);
                    sheet['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
                    XLSX.utils.book_append_sheet(workbook, sheet, 'Item Report');

                    // Generate filename
                    const monthName = new Date(2026, month - 1).toLocaleString('en-IN', { month: 'long' });
                    const filename = `Slopchest_Itemwise_${monthName}_${year}.xlsx`;

                    XLSX.writeFile(workbook, filename);
                } catch (error) {
                    // Error exporting to Excel
                    alert('Failed to export Excel file');
                }
            }
        }));

        // Then useEffect and other hooks
        useEffect(() => {
            if (selectedVessel && month && year) {
                fetchItemReport();
            }
        }, [selectedVessel, month, year]);

        const fetchItemReport = async () => {
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
                    
                    // Group by item and aggregate
                    const itemMap = new Map<number, ItemReport>();
                    
                    consumptions.forEach((c: any) => {
                        const itemId = c.item_id;
                        
                        if (!itemMap.has(itemId)) {
                            itemMap.set(itemId, {
                                item_id: itemId,
                                item_code: c.inventory_items.item_code,
                                item_name: c.inventory_items.item_name,
                                category: c.inventory_items.category,
                                unit_price: parseFloat(c.unit_price.toString()),
                                total_quantity: parseFloat(c.quantity.toString()),
                                total_deduction: parseFloat(c.total_deduction.toString()),
                                crew_count: 1
                            });
                        } else {
                            const existing = itemMap.get(itemId)!;
                            existing.total_quantity += parseFloat(c.quantity.toString());
                            existing.total_deduction += parseFloat(c.total_deduction.toString());
                            existing.crew_count += 1;
                        }
                    });

                    setItemData(Array.from(itemMap.values()).sort((a, b) => 
                        b.total_deduction - a.total_deduction
                    ));
                }
            } catch (err) {
                // Error fetching item report
            } finally {
                setLoading(false);
            }
        };

        if (loading) {
            return <div className="p-6 text-center text-gray-600">Loading report...</div>;
        }

        if (itemData.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <p className="text-center text-gray-600">No slopchest consumption data for this period</p>
                </div>
        );
    }

    const totalValue = itemData.reduce((sum, item) => sum + item.total_deduction, 0);
    const totalQty = itemData.reduce((sum, item) => sum + item.total_quantity, 0);

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="px-6 py-3 text-left font-semibold text-gray-800">Item Code</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-800">Item Name</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-800">Category</th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-800">Unit Price</th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-800">Total Qty</th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-800">Crew Count</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-800">Total Deduction</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {itemData.map((item, index) => (
                            <tr 
                                key={item.item_id}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                                <td className="px-6 py-3 font-medium text-gray-900">{item.item_code}</td>
                                <td className="px-6 py-3 text-gray-700">{item.item_name}</td>
                                <td className="px-6 py-3 text-gray-600 text-xs">
                                    {item.category || '-'}
                                </td>
                                <td className="px-6 py-3 text-center text-gray-700">
                                    ${item.unit_price.toFixed(2)}
                                </td>
                                <td className="px-6 py-3 text-center text-gray-700">
                                    {item.total_quantity.toFixed(2)}
                                </td>
                                <td className="px-6 py-3 text-center text-gray-700">
                                    {item.crew_count}
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-gray-900">
                                    ${item.total_deduction.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-blue-50 border-t-2 border-blue-300 font-bold">
                            <td colSpan={4} className="px-6 py-3 text-right text-gray-900">
                                TOTAL
                            </td>
                            <td className="px-6 py-3 text-center text-blue-600">
                                {totalQty.toFixed(2)}
                            </td>
                            <td className="px-6 py-3 text-center"></td>
                            <td className="px-6 py-3 text-right text-blue-600">
                                ${totalValue.toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                </div>
            </div>
        </div>
    );
    }
);

SlopchestItemwiseReport.displayName = 'SlopchestItemwiseReport';
export default SlopchestItemwiseReport;
