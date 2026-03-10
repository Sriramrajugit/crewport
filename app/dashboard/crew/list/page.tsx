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

export default function CrewList() {
    const [crew, setCrew] = useState<CrewMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('VESSEL');

    const fetchCrew = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/crew');
            if (response.ok) {
                setCrew(await response.json());
            }
        } catch (error) {
            console.error('Error fetching crew:', error);
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-blue-600">👤</span>
                    View Crew Members
                </h1>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name & Rank</th>
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
                            ) : crew.length === 0 ? (
                                <tr>
                                    <td colSpan={userRole === 'ADMIN' ? 9 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No crew records found.
                                    </td>
                                </tr>
                            ) : (
                                crew.map(member => (
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
