'use client';

import { useState, useEffect } from 'react';

interface CrewSummary {
    crew_member_id: number;
    crew_name: string;
    rank: string;
    item_count: number;
    total_deduction: number;
}

interface ConsumptionDetail {
    id: number;
    crew_member_id: number;
    item_id: number;
    consumption_date: string;
    quantity: number;
    unit_price: number;
    total_deduction: number;
    notes: string | null;
    inventory_items: {
        id: number;
        item_name: string;
        item_code: string;
        category: string | null;
    };
    crew_members: {
        id: number;
        name: string;
        rank: string;
    };
}

interface Summary {
    month: number;
    year: number;
    crew_summary: CrewSummary[];
    on_signers_total: number;
    grand_total: number;
}

interface Props {
    vesselId: number;
    month: number;
    year: number;
    refreshTrigger: number;
}

export default function SlopchestSummary({
    vesselId,
    month,
    year,
    refreshTrigger
}: Props) {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCrew, setSelectedCrew] = useState<CrewSummary | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [consumptionDetails, setConsumptionDetails] = useState<ConsumptionDetail[]>([]);

    useEffect(() => {
        fetchSummary();
    }, [vesselId, month, year, refreshTrigger]);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/slopchest/summary?month=${month}&year=${year}`,
                {
                    headers: {
                        'X-Vessel-Id': vesselId.toString()
                    }
                }
            );

            if (response.ok) {
                setSummary(await response.json());
            }
        } catch (err) {
            // Error fetching summary
        } finally {
            setLoading(false);
        }
    };

    const fetchCrewDetails = async (crew: CrewSummary) => {
        try {
            setDetailLoading(true);
            const response = await fetch(
                `/api/slopchest/consumption?month=${month}&year=${year}`,
                {
                    headers: {
                        'X-Vessel-Id': vesselId.toString()
                    }
                }
            );

            if (response.ok) {
                const allConsumptions = await response.json();
                const crewConsumptions = allConsumptions.filter(
                    (c: ConsumptionDetail) => c.crew_member_id === crew.crew_member_id
                );
                setConsumptionDetails(crewConsumptions);
                setSelectedCrew(crew);
            }
        } catch (err) {
            // Error fetching crew details
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading summary...</div>;
    }

    if (!summary || summary.crew_summary.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <p className="text-center text-gray-600">
                    No deductions recorded for this month
                </p>
            </div>
        );
    }

    const totalCrewDeduction = summary.crew_summary.reduce(
        (sum, crew) => sum + parseFloat(crew.total_deduction.toString()),
        0
    );

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Item Count
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Total Deduction
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {summary.crew_summary.map((crew, index) => (
                                <tr
                                    key={crew.crew_member_id}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                                        selectedCrew?.crew_member_id === crew.crew_member_id ? 'bg-blue-50' : ''
                                    } hover:bg-blue-100 cursor-pointer transition-colors`}
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {crew.rank}
                                    </td>
                                    <td 
                                        className="px-6 py-4 text-sm text-blue-600 font-medium hover:underline"
                                        onClick={() => fetchCrewDetails(crew)}
                                    >
                                        {crew.crew_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                                        {crew.item_count}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                                        ${parseFloat(crew.total_deduction.toString()).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Totals */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Crew Total:</span>
                        <span className="text-sm font-bold text-gray-900">${parseFloat(totalCrewDeduction.toString()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Owners/charterer Total:</span>
                        <span className="text-sm font-bold text-gray-900">
                            ${parseFloat(summary.on_signers_total.toString()).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                        <span className="text-base font-bold text-gray-900">Grand Total:</span>
                        <span className="text-base font-bold text-blue-600">
                            ${parseFloat(summary.grand_total.toString()).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Detail View */}
            {selectedCrew && (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-white">{selectedCrew.crew_name}</h3>
                            <p className="text-sm text-blue-100">{selectedCrew.rank}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedCrew(null);
                                setConsumptionDetails([]);
                            }}
                            className="text-white hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium"
                        >
                            ✕ Close
                        </button>
                    </div>

                    {detailLoading ? (
                        <div className="p-6 text-center text-gray-600">Loading details...</div>
                    ) : consumptionDetails.length === 0 ? (
                        <div className="p-6 text-center text-gray-600">
                            No consumption details found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
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
                                            Rate
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {consumptionDetails.map((detail, index) => (
                                        <tr 
                                            key={detail.id}
                                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                        >
                                            <td className="px-6 py-3 text-sm text-gray-700">
                                                {new Date(detail.consumption_date).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                {detail.inventory_items.item_code}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-700">
                                                {detail.inventory_items.item_name}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-center text-gray-700">
                                                {parseFloat(detail.quantity.toString())}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-right text-gray-700">
                                                ${parseFloat(detail.unit_price.toString()).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-3 text-sm font-bold text-right text-gray-900">
                                                ${parseFloat(detail.total_deduction.toString()).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-600">
                                                {detail.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                                        <td colSpan={5} className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                                            Total:
                                        </td>
                                        <td className="px-6 py-3 text-sm font-bold text-blue-600">
                                            ${consumptionDetails
                                                .reduce((sum, d) => sum + parseFloat(d.total_deduction.toString()), 0)
                                                .toFixed(2)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
