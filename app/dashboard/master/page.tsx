'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Rank {
    id: number;
    rank_name: string;
    rank_code: string;
    description?: string;
}

interface Port {
    id: number;
    code: string;
    name: string;
    country_code?: string;
    zone_code?: string;
    latitude?: number;
    longitude?: number;
}

interface ExchangeRate {
    id: number;
    usd_to_local: number;
    local_currency_code: string;
    effective_from: string;
}

type TabType = 'ranks' | 'ports' | 'exchange';

export default function MasterDataManagement() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('ranks');
    const [loading, setLoading] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [ports, setPorts] = useState<Port[]>([]);
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

    // Ports filtering and pagination
    const [portsLoading, setPortsLoading] = useState(false);
    const [portsTotal, setPortsTotal] = useState(0);
    const [portsOffset, setPortsOffset] = useState(0);
    const [portsSearch, setPortsSearch] = useState('');
    const [portsCountry, setPortsCountry] = useState('IN'); // Default to India
    const [portsSortBy] = useState('name');

    // Form states
    const [rankForm, setRankForm] = useState({ rank_name: '', rank_code: '', description: '' });
    const [portForm, setPortForm] = useState({ name: '', code: '', country_code: '', zone_code: '', latitude: '', longitude: '' });
    const [exchangeForm, setExchangeForm] = useState({ 
        usd_to_local: '', 
        local_currency_code: 'INR',
        effective_from: new Date().toISOString().split('T')[0]
    });

    const companyId = 1; // MOCK FOR NOW
    const userId = 1; // MOCK FOR NOW

    useEffect(() => {
        checkAccessAndFetchAllData();
    }, []);

    // Load ports with filters
    useEffect(() => {
        if (activeTab === 'ports' && hasAccess) {
            fetchPorts(0);
        }
    }, [activeTab, portsSearch, portsCountry, hasAccess]);

    const checkAccessAndFetchAllData = async () => {
        try {
            setIsCheckingAccess(true);
            
            // Try to fetch users (which requires admin access) to check if user has access
            const accessCheckRes = await fetch('/api/users');
            
            // If we get 403 (forbidden), user is not admin
            if (accessCheckRes.status === 403) {
                setHasAccess(false);
                setIsCheckingAccess(false);
                return;
            }
            
            // If we get 401 (unauthorized), redirect to login
            if (accessCheckRes.status === 401) {
                router.push('/login');
                return;
            }
            
            // User has access, proceed with fetching data
            setHasAccess(true);
            await fetchAllData();
        } catch (error) {
            console.error('Error checking access:', error);
            setHasAccess(false);
        } finally {
            setIsCheckingAccess(false);
        }
    };

    const fetchPorts = async (offset: number = 0) => {
        setPortsLoading(true);
        try {
            const params = new URLSearchParams({
                limit: '10',
                offset: offset.toString(),
                sort: portsSortBy,
                ...(portsSearch && { search: portsSearch }),
                ...(portsCountry && { country_code: portsCountry }),
            });

            const response = await fetch(`/api/masters/ports?${params}`);
            if (response.ok) {
                const result = await response.json();
                setPorts(result.data);
                setPortsTotal(result.pagination.total);
                setPortsOffset(offset);
            }
        } catch (error) {
            console.error('Error fetching ports:', error);
            alert('Error loading ports');
        } finally {
            setPortsLoading(false);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [ranksRes, exchangeRes] = await Promise.all([
                fetch(`/api/masters/ranks?companyId=${companyId}`),
                fetch(`/api/masters/exchange?companyId=${companyId}`)
            ]);

            if (ranksRes.ok) setRanks(await ranksRes.json());
            if (exchangeRes.ok) setExchangeRates(await exchangeRes.json());
            
            // Load default ports (India with limit 10)
            await fetchPorts(0);
        } catch (error) {
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

        // Check for duplicate rank (case-insensitive)
        const rankNameLower = rankForm.rank_name.trim().toLowerCase();
        const isDuplicate = ranks.some(rank => rank.rank_name.toLowerCase() === rankNameLower);
        
        if (isDuplicate) {
            alert(`Rank "${rankForm.rank_name}" already exists. Rank names are case-insensitive.`);
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
            alert(`Error adding rank: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleAddPort = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!portForm.name || !portForm.code) {
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
            setPortForm({ name: '', code: '', country_code: '', zone_code: '', latitude: '', longitude: '' });
            // Refresh ports list
            await fetchPorts(0);
        } catch (error) {
            console.error(error);
            alert('Error adding port');
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

    // Show access check loading screen
    if (isCheckingAccess) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3">⚙️</span>
                    Master Data Management
                </h1>
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    // Show access denied message if user is not admin
    if (!hasAccess) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800">
                        You do not have permission to access the Master Data Management section. Only administrators can manage master data.
                    </p>
                </div>
            </div>
        );
    }

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
                    {(['ranks', 'ports', 'exchange'] as TabType[]).map((tab) => (
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
                                <div>
                                    <input
                                        type="text"
                                        value={rankForm.rank_name}
                                        onChange={(e) => setRankForm({ ...rankForm, rank_name: e.target.value })}
                                        className={`w-full mt-1 px-3 py-2 border rounded-md ${
                                            rankForm.rank_name && ranks.some(rank => rank.rank_name.toLowerCase() === rankForm.rank_name.trim().toLowerCase())
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {rankForm.rank_name && ranks.some(rank => rank.rank_name.toLowerCase() === rankForm.rank_name.trim().toLowerCase()) && (
                                        <p className="mt-1 text-xs text-red-600 font-medium">
                                            ✗ This rank already exists (case-insensitive check)
                                        </p>
                                    )}
                                </div>
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
                                disabled={!!(!rankForm.rank_name || !rankForm.rank_code || (rankForm.rank_name && ranks.some(rank => rank.rank_name.toLowerCase() === rankForm.rank_name.trim().toLowerCase())))}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 transition-colors font-medium"
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
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Add New Port</h2>
                        <form onSubmit={handleAddPort} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Port Name *</label>
                                    <input
                                        type="text"
                                        value={portForm.name}
                                        onChange={(e) => setPortForm({ ...portForm, name: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Port Code *</label>
                                    <input
                                        type="text"
                                        value={portForm.code}
                                        onChange={(e) => setPortForm({ ...portForm, code: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country Code</label>
                                    <input
                                        type="text"
                                        value={portForm.country_code}
                                        onChange={(e) => setPortForm({ ...portForm, country_code: e.target.value })}
                                        placeholder="e.g., IN, US, SG"
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Zone Code</label>
                                    <input
                                        type="text"
                                        value={portForm.zone_code}
                                        onChange={(e) => setPortForm({ ...portForm, zone_code: e.target.value })}
                                        placeholder="e.g., Asia, Europe"
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={portForm.latitude}
                                        onChange={(e) => setPortForm({ ...portForm, latitude: e.target.value })}
                                        placeholder="e.g., 13.067439"
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={portForm.longitude}
                                        onChange={(e) => setPortForm({ ...portForm, longitude: e.target.value })}
                                        placeholder="e.g., 80.278296"
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add Port
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Existing Ports</h2>
                        
                        {/* Filters */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search Port Name/Code</label>
                                <input
                                    type="text"
                                    value={portsSearch}
                                    onChange={(e) => setPortsSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                                <input
                                    type="text"
                                    value={portsCountry}
                                    onChange={(e) => setPortsCountry(e.target.value)}
                                    placeholder="e.g., IN, US"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Ports Table */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Port Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Country</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Zone</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Coordinates</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {portsLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                                                Loading ports...
                                            </td>
                                        </tr>
                                    ) : ports.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                                                No ports found
                                            </td>
                                        </tr>
                                    ) : (
                                        ports.map((port) => (
                                            <tr key={port.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{port.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{port.code}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{port.country_code || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{port.zone_code || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {port.latitude || port.longitude
                                                        ? `${port.latitude?.toFixed(4) || '-'}, ${port.longitude?.toFixed(4) || '-'}`
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Showing {ports.length === 0 ? 0 : portsOffset + 1}-{Math.min(portsOffset + 10, portsTotal)} of {portsTotal} ports
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchPorts(Math.max(0, portsOffset - 10))}
                                    disabled={portsOffset === 0 || portsLoading}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchPorts(portsOffset + 10)}
                                    disabled={portsOffset + 10 >= portsTotal || portsLoading}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
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
