'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BondForm from '@/components/BondForm';

export default function BondPage() {
    const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
    const [vessels, setVessels] = useState<any[]>([]);
    const [bondRecords, setBondRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch vessels for form dropdown
        const fetchVessels = async () => {
            try {
                const response = await fetch('/api/vessels');
                if (response.ok) {
                    const data = await response.json();
                    setVessels(data);
                }
            } catch (error) {
                console.error('Error fetching vessels:', error);
            }
        };

        fetchVessels();
    }, []);

    const handleTabChange = (tab: 'form' | 'list') => {
        setActiveTab(tab);
        if (tab === 'list') {
            fetchBondRecords();
        }
    };

    const fetchBondRecords = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/purchases?type=BOND');
            if (response.ok) {
                const data = await response.json();
                setBondRecords(data);
            }
        } catch (error) {
            console.error('Error fetching bond records:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3 text-indigo-600">📦</span>
                Bond Purchase
            </h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            onClick={() => handleTabChange('form')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'form'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            New Purchase
                        </button>
                        <button
                            onClick={() => handleTabChange('list')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'list'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Purchase History
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'form' && (
                        <BondForm vessels={vessels} onSuccess={() => handleTabChange('list')} />
                    )}

                    {activeTab === 'list' && (
                        <div>
                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Loading bond records...</p>
                                </div>
                            ) : bondRecords.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-medium text-gray-700">PO No</th>
                                                <th className="px-6 py-3 text-left font-medium text-gray-700">RFQ No</th>
                                                <th className="px-6 py-3 text-left font-medium text-gray-700">Log Period</th>
                                                <th className="px-6 py-3 text-right font-medium text-gray-700">Amount USD</th>
                                                <th className="px-6 py-3 text-right font-medium text-gray-700">Exchange Rate</th>
                                                <th className="px-6 py-3 text-right font-medium text-gray-700">Total Local</th>
                                                <th className="px-6 py-3 text-center font-medium text-gray-700">Status</th>
                                                <th className="px-6 py-3 text-center font-medium text-gray-700">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {bondRecords.map((record: any) => (
                                                <tr key={record.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{record.po_no}</td>
                                                    <td className="px-6 py-4 text-gray-600">{record.rfq_no}</td>
                                                    <td className="px-6 py-4 text-gray-600">{record.log_period}</td>
                                                    <td className="px-6 py-4 text-right text-gray-900">
                                                        ${parseFloat(record.base_amount_usd).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-600">
                                                        {parseFloat(record.exchange_rate).toFixed(4)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                                        ${parseFloat(record.total_local).toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                record.approval_status === 'APPROVED'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : record.approval_status === 'REJECTED'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                        >
                                                            {record.approval_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-600 text-sm">
                                                        {new Date(record.created_at).toLocaleDateString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 mb-4">No bond purchases recorded yet</p>
                                    <button
                                        onClick={() => handleTabChange('form')}
                                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        Create your first bond purchase
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
