'use client';

import { useState, useEffect } from 'react';
import { useVessel } from '@/app/context/VesselContext';

interface KPIData {
    totalVessels: number;
    activeVessels: number;
    totalCrewOnboard: number;
    crewSignOnThisMonth: number;
    crewSignOffThisMonth: number;
    pendingRequests: number;
    monthlyFleetExpense: number;
    avgCrewPerVessel: number;
}

export default function Dashboard() {
    const { selectedVessel } = useVessel();
    const [kpiData, setKpiData] = useState<KPIData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!selectedVessel) return;

        const fetchKPIs = async () => {
            try {
                const response = await fetch('/api/dashboard/kpis', {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch KPIs');
                const data = await response.json();
                setKpiData(data);
            } catch (error) {
                console.error('Error fetching KPIs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchKPIs();
    }, [selectedVessel]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const KPICard = ({ 
        title, 
        value, 
        icon, 
        color,
        subtitle 
    }: { 
        title: string; 
        value: string | number; 
        icon: string; 
        color: string;
        subtitle?: string;
    }) => (
        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-blue-600">📊</span>
                    Fleet Overview Dashboard
                </h1>
                <div className="text-center py-12">
                    <p className="text-gray-600">Loading KPIs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-blue-600">📊</span>
                    Fleet Overview Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Real-time fleet and crew management metrics</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Vessel KPIs */}
                <KPICard
                    title="Total Vessels"
                    value={kpiData?.totalVessels ?? 0}
                    icon="⛴️"
                    color="border-blue-500"
                    subtitle="In system"
                />
                
                <KPICard
                    title="Active Vessels"
                    value={kpiData?.activeVessels ?? 0}
                    icon="🚢"
                    color="border-green-500"
                    subtitle="Currently operating"
                />

                {/* Crew KPIs */}
                <KPICard
                    title="Total Crew Onboard"
                    value={kpiData?.totalCrewOnboard ?? 0}
                    icon="👥"
                    color="border-purple-500"
                    subtitle="Active status"
                />

                <KPICard
                    title="Avg Crew Per Vessel"
                    value={kpiData?.avgCrewPerVessel ?? 0}
                    icon="📈"
                    color="border-indigo-500"
                    subtitle="Average density"
                />

                {/* Monthly Activities */}
                <KPICard
                    title="Sign-on This Month"
                    value={kpiData?.crewSignOnThisMonth ?? 0}
                    icon="✨"
                    color="border-emerald-500"
                    subtitle="New joiners"
                />

                <KPICard
                    title="Sign-off This Month"
                    value={kpiData?.crewSignOffThisMonth ?? 0}
                    icon="📋"
                    color="border-orange-500"
                    subtitle="Completed contracts"
                />

                {/* Financial & Admin KPIs */}
                <KPICard
                    title="Monthly Fleet Expense"
                    value={formatCurrency(kpiData?.monthlyFleetExpense ?? 0)}
                    icon="💰"
                    color="border-red-500"
                    subtitle="Provisions + Purchases"
                />

                <KPICard
                    title="Pending Requests"
                    value={kpiData?.pendingRequests ?? 0}
                    icon="⏳"
                    color="border-yellow-500"
                    subtitle="Awaiting approval"
                />
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <p className="text-gray-600">Fleet Utilization</p>
                        <p className="text-xl font-bold text-blue-600 mt-1">
                            {kpiData ? Math.round((kpiData.activeVessels / kpiData.totalVessels) * 100) : 0}%
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Crew Strength</p>
                        <p className="text-xl font-bold text-indigo-600 mt-1">
                            {kpiData?.totalCrewOnboard ?? 0} / {kpiData ? Math.round(kpiData.totalCrewOnboard + kpiData.crewSignOnThisMonth) : 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Approval Pending</p>
                        <p className="text-xl font-bold text-orange-600 mt-1">
                            {kpiData?.pendingRequests ?? 0} items
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
