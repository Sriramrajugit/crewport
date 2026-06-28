'use client';

import { useState, useEffect } from 'react';
import VictualsConsumption from '@/components/dashboard/VictualsConsumption';

interface VesselKPI {
    vessel_id: number;
    vessel_name: string;
    pendingRequests: number;
    crewSignOnThisMonth: number;
    crewSignOffThisMonth: number;
    totalCrewOnboard: number;
    contractsExpiringIn30Days: number;
    hraTransitDays: number;
}

interface AllKPIData {
    vessels: VesselKPI[];
    totalVesselsTagged: number;
}

export default function Dashboard() {
    const [kpiData, setKpiData] = useState<AllKPIData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKPIs = async () => {
            try {
                const response = await fetch('/api/dashboard/all-kpis');
                
                // If 401, user is not authenticated
                if (response.status === 401) {
                    setError('Not authenticated. Please log in first.');
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                    return;
                }
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch KPIs');
                }
                
                const data = await response.json();
                setKpiData(data);
            } catch (error) {
                console.error('Error fetching KPIs:', error);
                setError((error as Error).message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchKPIs();
    }, []);

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
        <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${color}`}>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">{title}</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
                </div>
                <span className="text-2xl">{icon}</span>
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

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-blue-600">📊</span>
                    Fleet Overview Dashboard
                </h1>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800"><strong>⚠️ Error:</strong> {error}</p>
                    {error.includes('Not authenticated') && (
                        <p className="text-yellow-700 mt-2">Redirecting to login...</p>
                    )}
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

            {/* Fleet Summary Table */}
            {kpiData && kpiData.vessels.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Vessel Name</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">
                                        <span className="flex items-center justify-center gap-2">
                                            <span>⏳</span>
                                            <span>Pending Requests</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">
                                        <span className="flex items-center justify-center gap-2">
                                            <span>✨</span>
                                            <span>Sign-on This Month</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">
                                        <span className="flex items-center justify-center gap-2">
                                            <span>📋</span>
                                            <span>Sign-off This Month</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">
                                        <span className="flex items-center justify-center gap-2">
                                            <span>👥</span>
                                            <span>Total Crew Onboard</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">
                                        <span className="flex items-center justify-center gap-2">
                                            <span>⏰</span>
                                            <span>Contracts Expiring in 30 Days</span>
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">
                                        <span className="flex items-center justify-center gap-2">
                                            <span>✈️</span>
                                            <span>HRA Transit Days</span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {kpiData.vessels.map((vessel, index) => (
                                    <tr key={vessel.vessel_id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{vessel.vessel_name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                                vessel.pendingRequests > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {vessel.pendingRequests}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                                vessel.crewSignOnThisMonth > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {vessel.crewSignOnThisMonth}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                                vessel.crewSignOffThisMonth > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {vessel.crewSignOffThisMonth}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                                {vessel.totalCrewOnboard}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                                vessel.contractsExpiringIn30Days > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {vessel.contractsExpiringIn30Days}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                                vessel.hraTransitDays > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {vessel.hraTransitDays}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {kpiData && kpiData.vessels.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600">No vessels assigned to your account.</p>
                </div>
            )}

            {/* Victualling Consumption Section */}
            <VictualsConsumption />
        </div>
    );
}
