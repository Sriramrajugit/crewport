'use client';

import { useState, useEffect } from 'react';

interface OnSignerRecord {
    id: number;
    signer_name: string;
    item_name: string;
    item_code: string;
    quantity: number;
    unit_price: number;
    total_deduction: number;
    remarks: string | null;
    consumption_date: string | Date;
}

interface Props {
    vesselId: number;
    month: number;
    year: number;
    refreshTrigger: number;
}

export default function SlopchestOnSigners({
    vesselId,
    month,
    year,
    refreshTrigger
}: Props) {
    const [records, setRecords] = useState<OnSignerRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'consumption_date' | 'item_name' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        fetchOnSigners();
    }, [vesselId, month, year, refreshTrigger]);

    const fetchOnSigners = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/slopchest/on-signers?month=${month}&year=${year}`,
                {
                    headers: {
                        'X-Vessel-Id': vesselId.toString()
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setRecords(data);
            }
        } catch (err) {
            // Error fetching on-signers
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column: 'consumption_date' | 'item_name') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortedRecords = () => {
        if (!sortBy) return records;
        const sorted = [...records].sort((a, b) => {
            let valueA: any = '';
            let valueB: any = '';

            if (sortBy === 'consumption_date') {
                valueA = new Date(a.consumption_date).getTime();
                valueB = new Date(b.consumption_date).getTime();
            } else if (sortBy === 'item_name') {
                valueA = a.item_name.toLowerCase();
                valueB = b.item_name.toLowerCase();
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortOrder === 'asc' 
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            } else {
                return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
            }
        });
        return sorted;
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading Owners/charterer data...</div>;
    }

    if (records.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <p className="text-center text-gray-600">
                    No on-signer deductions recorded for this month
                </p>
            </div>
        );
    }

    const totalDeduction = records.reduce((sum, record) => sum + parseFloat(record.total_deduction.toString()), 0);

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th 
                                    onClick={() => handleSort('consumption_date')}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    Date {sortBy === 'consumption_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Signer Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Item Code
                                </th>
                                <th 
                                    onClick={() => handleSort('item_name')}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    Item Name {sortBy === 'item_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Qty
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Unit Price
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {getSortedRecords().map((record, index) => (
                                <tr
                                    key={record.id}
                                    className={
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }
                                >
                                    <td className="px-6 py-3 text-sm text-gray-700">
                                        {new Date(record.consumption_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                        {record.signer_name}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                        {record.item_code}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-700">
                                        {record.item_name}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-center text-gray-700">
                                        {record.quantity}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700">
                                        ${parseFloat(record.unit_price.toString()).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-bold text-right text-gray-900">
                                        ${parseFloat(record.total_deduction.toString()).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-600">
                                        {record.remarks || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grand Total */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Owners/charterer Grand Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                        ${parseFloat(totalDeduction.toString()).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
