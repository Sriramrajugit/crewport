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
    const [groupedBySigner, setGroupedBySigner] = useState<
        Record<string, OnSignerRecord[]>
    >({});

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

                // Group by signer name
                const grouped = data.reduce(
                    (acc: Record<string, OnSignerRecord[]>, record: OnSignerRecord) => {
                        if (!acc[record.signer_name]) {
                            acc[record.signer_name] = [];
                        }
                        acc[record.signer_name].push(record);
                        return acc;
                    },
                    {}
                );
                setGroupedBySigner(grouped);
            }
        } catch (err) {
            console.error('Error fetching on-signers:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading on-signers data...</div>;
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
    const signerNames = Object.keys(groupedBySigner);

    return (
        <div className="space-y-4">
            {signerNames.map((signerName) => {
                const signerRecords = groupedBySigner[signerName];
                const signerTotal = signerRecords.reduce(
                    (sum, record) => sum + parseFloat(record.total_deduction.toString()),
                    0
                );

                return (
                    <div
                        key={signerName}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                    >
                        <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {signerName}
                                </h3>
                                <span className="text-sm font-bold text-blue-600">
                                    ₹{parseFloat(signerTotal.toString()).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Item Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Item Name
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
                                    {signerRecords.map((record, index) => (
                                        <tr
                                            key={record.id}
                                            className={
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }
                                        >
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
                                                ₹{parseFloat(record.unit_price.toString()).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-3 text-sm font-bold text-right text-gray-900">
                                                ₹{parseFloat(record.total_deduction.toString()).toFixed(2)}
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
                );
            })}

            {/* Grand Total */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">On-Signers Grand Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                        ₹{parseFloat(totalDeduction.toString()).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
