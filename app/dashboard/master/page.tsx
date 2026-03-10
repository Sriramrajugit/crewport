'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Rank {
    id: number;
    rank_name: string;
    rank_code: string;
    description?: string;
}

interface Port {
    id: number;
    port_name: string;
    port_code: string;
    country?: string;
}

interface Vessel {
    id: number;
    vessel_name: string;
    imo_number?: string;
    vessel_type?: string;
}

interface ExchangeRate {
    id: number;
    usd_to_local: number;
    local_currency_code: string;
    effective_from: string;
}

type TabType = 'ranks' | 'ports' | 'vessels' | 'exchange';

export default function MasterDataManagement() {
    const [activeTab, setActiveTab] = useState<TabType>('ranks');
    const [loading, setLoading] = useState(false);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [ports, setPorts] = useState<Port[]>([]);
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

    // Form states
    const [rankForm, setRankForm] = useState({ rank_name: '', rank_code: '', description: '' });
    const [portForm, setPortForm] = useState({ port_name: '', port_code: '', country: '' });
    const [vesselForm, setVesselForm] = useState({ vessel_name: '', imo_number: '', vessel_type: '' });
    const [exchangeForm, setExchangeForm] = useState({ 
        usd_to_local: '', 
        local_currency_code: 'INR',
        effective_from: new Date().toISOString().split('T')[0]
    });

    const companyId = 1; // MOCK FOR NOW
    const userId = 1; // MOCK FOR NOW

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [ranksRes, portsRes, vesselsRes, exchangeRes] = await Promise.all([
                fetch(`/api/masters/ranks?companyId=${companyId}`),
                fetch('/api/masters/ports'),
                fetch(`/api/masters/vessels?companyId=${companyId}`),
                fetch(`/api/masters/exchange?companyId=${companyId}`)
            ]);

            if (ranksRes.ok) setRanks(await ranksRes.json());
            if (portsRes.ok) setPorts(await portsRes.json());
            if (vesselsRes.ok) setVessels(await vesselsRes.json());
            if (exchangeRes.ok) setExchangeRates(await exchangeRes.json());
        } catch (error) {
            console.error('Error fetching master data:', error);
            alert('Error loading master data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRank = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rankForm.rank_name || !rankForm.rank_code) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/masters/ranks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...rankForm, company_id: companyId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add rank');
            }

            alert('Rank added successfully');
            setRankForm({ rank_name: '', rank_code: '', description: '' });
            fetchAllData();
        } catch (error) {
            console.error('Error adding rank:', error);
            alert(`Error adding rank: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleAddPort = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!portForm.port_name || !portForm.port_code) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/masters/ports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portForm),
            });

            if (!response.ok) throw new Error('Failed to add port');

            alert('Port added successfully');
            setPortForm({ port_name: '', port_code: '', country: '' });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert('Error adding port');
        }
    };

    const handleAddVessel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vesselForm.vessel_name) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/masters/vessels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...vesselForm, company_id: companyId }),
            });

            if (!response.ok) throw new Error('Failed to add vessel');

            alert('Vessel added successfully');
            setVesselForm({ vessel_name: '', imo_number: '', vessel_type: '' });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert('Error adding vessel');
        }
    };

    const handleAddExchange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exchangeForm.usd_to_local || !exchangeForm.effective_from) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/masters/exchange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...exchangeForm,
                    usd_to_local: parseFloat(exchangeForm.usd_to_local),
                    company_id: companyId,
                    created_by: userId
                }),
            });

            if (!response.ok) throw new Error('Failed to add exchange rate');

            alert('Exchange rate added successfully');
            setExchangeForm({ 
                usd_to_local: '', 
                local_currency_code: 'INR',
                effective_from: new Date().toISOString().split('T')[0]
            });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert('Error adding exchange rate');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-blue-600">⚙️</span>
                    Master Data Management
                </h1>
                <Link
                    href="/dashboard/master/users"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    👤 Manage Users
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex space-x-8">
                    {(['ranks', 'ports', 'vessels', 'exchange'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ranks Tab */}
            {activeTab === 'ranks' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Add New Rank</h2>
                        <form onSubmit={handleAddRank} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rank Name *</label>
                                <input
                                    type="text"
                                    value={rankForm.rank_name}
                                    onChange={(e) => setRankForm({ ...rankForm, rank_name: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rank Code *</label>
                                <input
                                    type="text"
                                    value={rankForm.rank_code}
                                    onChange={(e) => setRankForm({ ...rankForm, rank_code: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={rankForm.description}
                                    onChange={(e) => setRankForm({ ...rankForm, description: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                            >
                                Add Rank
                            </button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Existing Ranks</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {ranks.length === 0 ? (
                                <p className="text-gray-500">No ranks found</p>
                            ) : (
                                ranks.map((rank) => (
                                    <div key={rank.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                        <p className="font-semibold">{rank.rank_name}</p>
                                        <p className="text-sm text-gray-600">{rank.rank_code}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Ports Tab */}
            {activeTab === 'ports' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Add New Port</h2>
                        <form onSubmit={handleAddPort} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Port Name *</label>
                                <input
                                    type="text"
                                    value={portForm.port_name}
                                    onChange={(e) => setPortForm({ ...portForm, port_name: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Port Code *</label>
                                <input
                                    type="text"
                                    value={portForm.port_code}
                                    onChange={(e) => setPortForm({ ...portForm, port_code: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    value={portForm.country}
                                    onChange={(e) => setPortForm({ ...portForm, country: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                            >
                                Add Port
                            </button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Existing Ports</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {ports.length === 0 ? (
                                <p className="text-gray-500">No ports found</p>
                            ) : (
                                ports.map((port) => (
                                    <div key={port.id} className="border-l-4 border-green-500 pl-4 py-2">
                                        <p className="font-semibold">{port.port_name}</p>
                                        <p className="text-sm text-gray-600">{port.port_code} • {port.country}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Vessels Tab */}
            {activeTab === 'vessels' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Add New Vessel</h2>
                        <form onSubmit={handleAddVessel} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vessel Name *</label>
                                <input
                                    type="text"
                                    value={vesselForm.vessel_name}
                                    onChange={(e) => setVesselForm({ ...vesselForm, vessel_name: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">IMO Number</label>
                                <input
                                    type="text"
                                    value={vesselForm.imo_number}
                                    onChange={(e) => setVesselForm({ ...vesselForm, imo_number: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vessel Type</label>
                                <input
                                    type="text"
                                    value={vesselForm.vessel_type}
                                    onChange={(e) => setVesselForm({ ...vesselForm, vessel_type: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                            >
                                Add Vessel
                            </button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Existing Vessels</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {vessels.length === 0 ? (
                                <p className="text-gray-500">No vessels found</p>
                            ) : (
                                vessels.map((vessel) => (
                                    <div key={vessel.id} className="border-l-4 border-purple-500 pl-4 py-2">
                                        <p className="font-semibold">{vessel.vessel_name}</p>
                                        <p className="text-sm text-gray-600">{vessel.imo_number} • {vessel.vessel_type}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Exchange Rates Tab */}
            {activeTab === 'exchange' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Add Exchange Rate</h2>
                        <form onSubmit={handleAddExchange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">USD to Local *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={exchangeForm.usd_to_local}
                                    onChange={(e) => setExchangeForm({ ...exchangeForm, usd_to_local: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Currency Code</label>
                                <input
                                    type="text"
                                    value={exchangeForm.local_currency_code}
                                    onChange={(e) => setExchangeForm({ ...exchangeForm, local_currency_code: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Effective From *</label>
                                <input
                                    type="date"
                                    value={exchangeForm.effective_from}
                                    onChange={(e) => setExchangeForm({ ...exchangeForm, effective_from: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                            >
                                Add Exchange Rate
                            </button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Existing Rates</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {exchangeRates.length === 0 ? (
                                <p className="text-gray-500">No exchange rates found</p>
                            ) : (
                                exchangeRates.map((rate) => (
                                    <div key={rate.id} className="border-l-4 border-orange-500 pl-4 py-2">
                                        <p className="font-semibold">1 USD = {rate.usd_to_local} {rate.local_currency_code}</p>
                                        <p className="text-sm text-gray-600">Effective from {new Date(rate.effective_from).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
