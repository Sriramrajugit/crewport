'use client';

import { useState, useEffect } from 'react';

interface VictualsConsumption {
    vessel_id: number;
    vessel_name: string;
    crew_count: number;
    total_man_days: number;
    total_meals: number;
    month: number;
    year: number;
}

interface SummaryMetrics {
    total_crew: number;
    total_man_days: number;
    total_meals: number;
}

interface ApiResponse {
    data: VictualsConsumption[];
    summary: SummaryMetrics;
}

export default function VictualsConsumptionComponent() {
    const [consumptionData, setConsumptionData] = useState<VictualsConsumption[]>([]);
    const [summary, setSummary] = useState<SummaryMetrics>({
        total_crew: 0,
        total_man_days: 0,
        total_meals: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchConsumptionData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/dashboard/victualling-consumption?month=${currentMonth}&year=${currentYear}`
                );
                if (!response.ok) throw new Error('Failed to fetch consumption data');
                const apiData: ApiResponse = await response.json();
                setConsumptionData(apiData.data || []);
                setSummary(apiData.summary || {
                    total_crew: 0,
                    total_man_days: 0,
                    total_meals: 0
                });
            } catch (error) {
                console.error('Error fetching victualling consumption:', error);
                setConsumptionData([]);
                setSummary({
                    total_crew: 0,
                    total_man_days: 0,
                    total_meals: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchConsumptionData();
    }, [currentMonth, currentYear]);

    const previousMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        const today = new Date();
        const nextMonthDate = new Date(
            currentMonth === 12 ? currentYear + 1 : currentYear,
            currentMonth === 12 ? 0 : currentMonth,
            1
        );
        
        // Don't allow navigation to future months
        if (nextMonthDate > today) {
            return;
        }

        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const isNextMonthDisabled = () => {
        const today = new Date();
        const nextMonthDate = new Date(
            currentMonth === 12 ? currentYear + 1 : currentYear,
            currentMonth === 12 ? 0 : currentMonth,
            1
        );
        return nextMonthDate > today;
    };

    return (
        <div className="space-y-6">
            {/* Header and Month Navigation */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-2xl">🍽️</span>
                        Victualling Summary
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Crew victualling details per vessel</p>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <button
                        onClick={previousMonth}
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        ← Prev
                    </button>
                    <span className="text-sm font-semibold text-gray-900 min-w-[140px] text-center">
                        {new Date(currentYear, currentMonth - 1).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                    <button
                        onClick={nextMonth}
                        disabled={isNextMonthDisabled()}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isNextMonthDisabled()
                                ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Next →
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-gray-600">Loading victualling data...</p>
                </div>
            ) : consumptionData.length === 0 ? (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-700">No victualling records found for this period.</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600">Total Crew</h3>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total_crew}</p>
                                    <p className="mt-1 text-xs text-gray-400">Crew members</p>
                                </div>
                                <span className="text-4xl">👥</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600">Total Man-Days</h3>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total_man_days}</p>
                                    <p className="mt-1 text-xs text-gray-400">Days worked</p>
                                </div>
                                <span className="text-4xl">📅</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600">Total Meals</h3>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total_meals}</p>
                                    <p className="mt-1 text-xs text-gray-400">Meals served</p>
                                </div>
                                <span className="text-4xl">🍽️</span>
                            </div>
                        </div>
                    </div>

                    {/* Victualling Summary Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                            Vessel Name
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                            Crew Count
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                            Man-Days
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                            Meals
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consumptionData.map((vessel, idx) => (
                                        <tr
                                            key={vessel.vessel_id}
                                            className={`border-b border-gray-200 ${
                                                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-blue-50 transition-colors`}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {vessel.vessel_name}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {vessel.crew_count}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {vessel.total_man_days}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-semibold text-orange-600">
                                                {vessel.total_meals}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
