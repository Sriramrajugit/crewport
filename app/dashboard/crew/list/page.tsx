'use client';

import { useState, useEffect } from 'react';
import { formatDateDDMMYYYY } from '@/lib/formatters';

interface Vessel {
    id: number;
    vessel_name: string;
}

interface CrewMember {
    id: number;
    name: string;
    rank: string | null;
    nationality: string | null;
    passport_number: string | null;
    vessel_id: number;
    vessels: Vessel;
    onboarding_status: string;
    date_of_birth: string | null;
    sign_on_date: string | null;
    sign_off_date: string | null;
    sign_on_port: string | null;
    sign_off_port: string | null;
}

type SortField = 'name' | 'passport' | 'rank' | null;
type SortOrder = 'asc' | 'desc';

export default function CrewList() {
    const [crew, setCrew] = useState<CrewMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('VESSEL');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const fetchCrew = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/crew');
            if (response.ok) {
                setCrew(await response.json());
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const sessionStr = localStorage.getItem('crewport_session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            setUserRole(session.role);
        }
        fetchCrew();
    }, []);

    const handleApprove = async (id: number) => {
        // TODO: Implement approve endpoint
        alert("Approval endpoint not yet fully implemented in mock.");
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle sort order if clicking the same field
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new sort field with ascending order
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getFilteredAndSortedCrew = () => {
        let filtered = crew.filter(member => {
            const searchLower = searchTerm.toLowerCase();
            return (
                member.name.toLowerCase().includes(searchLower) ||
                (member.passport_number && member.passport_number.toLowerCase().includes(searchLower)) ||
                (member.rank && member.rank.toLowerCase().includes(searchLower))
            );
        });

        if (sortField) {
            filtered.sort((a, b) => {
                let aValue: string = '';
                let bValue: string = '';

                if (sortField === 'name') {
                    aValue = a.name;
                    bValue = b.name;
                } else if (sortField === 'passport') {
                    aValue = a.passport_number || '';
                    bValue = b.passport_number || '';
                } else if (sortField === 'rank') {
                    aValue = a.rank || '';
                    bValue = b.rank || '';
                }

                if (sortOrder === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            });
        }

        return filtered;
    };

    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return ' ↕️';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-blue-600">👤</span>
                    View Crew Members
                </h1>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">🔍 Search:</span>
                        <input
                            type="text"
                            placeholder="Search by name, passport, or rank..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">
                        Found {getFilteredAndSortedCrew().length} of {crew.length} crew member(s)
                    </div>
                </div>
            </div>

            {/* Crew List Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">All Crew Members</h3>
                    <span className="text-sm text-gray-600">{crew.length} crew member(s)</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th 
                                    onClick={() => handleSort('passport')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
                                    title="Click to sort"
                                >
                                    Passport No{getSortIndicator('passport')}
                                </th>
                                <th 
                                    onClick={() => handleSort('name')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
                                    title="Click to sort"
                                >
                                    Name & Rank{getSortIndicator('name')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign Off</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {userRole === 'ADMIN' && (
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={userRole === 'ADMIN' ? 9 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Loading crew data...
                                    </td>
                                </tr>
                            ) : getFilteredAndSortedCrew().length === 0 ? (
                                <tr>
                                    <td colSpan={userRole === 'ADMIN' ? 9 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
                                        {searchTerm ? 'No crew members match your search.' : 'No crew records found.'}
                                    </td>
                                </tr>
                            ) : (
                                getFilteredAndSortedCrew().map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.passport_number || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                            <div className="text-sm text-gray-500">{member.rank || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.date_of_birth ? formatDateDDMMYYYY(member.date_of_birth) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.nationality || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.vessels?.vessel_name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>{member.sign_on_date ? formatDateDDMMYYYY(member.sign_on_date) : '-'}</div>
                                            <div className="text-xs text-gray-500">{member.sign_on_port || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>{member.sign_off_date ? formatDateDDMMYYYY(member.sign_off_date) : '-'}</div>
                                            <div className="text-xs text-gray-500">{member.sign_off_port || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.onboarding_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    member.onboarding_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {member.onboarding_status || 'PENDING'}
                                            </span>
                                        </td>
                                        {userRole === 'ADMIN' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {member.onboarding_status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleApprove(member.id)}
                                                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
