'use client';

import { useState, useEffect } from 'react';
import { useVessel } from '@/app/context/VesselContext';

interface CrewMember {
    id: number;
    name: string;
    passport_number: string | null;
    rank: string | null;
    sign_on_date: string | null;
    sign_off_date: string | null;
    basic_salary: number | null;
    travel_wages: number | null;
    hra: number | null;
    vessels: {
        vessel_name: string;
    };
}

interface TravelWagesData {
    crew_id: number;
    days: number;
    calculated_amount: number;
}

interface HRAData {
    crew_id: number;
    days: number;
    calculated_amount: number;
}

export default function TravelWagesHRA() {
    const { selectedVessel } = useVessel();
    const [activeTab, setActiveTab] = useState<'travel-wages' | 'hra'>('travel-wages');
    const [travelMonth, setTravelMonth] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [crew, setCrew] = useState<CrewMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [travelWagesData, setTravelWagesData] = useState<Record<number, TravelWagesData>>({});
    const [savingTravel, setSavingTravel] = useState(false);
    const [hraStartDate, setHraStartDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [hraEndDate, setHraEndDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [hraData, setHraData] = useState<Record<number, HRAData>>({});
    const [savingHRA, setSavingHRA] = useState(false);
    const [savedHRARecords, setSavedHRARecords] = useState<any[]>([]);
    const [loadingSavedHRA, setLoadingSavedHRA] = useState(false);
    const [savedTravelWagesRecords, setSavedTravelWagesRecords] = useState<any[]>([]);
    const [loadingSavedTravel, setLoadingSavedTravel] = useState(false);

    // Fetch crew members when dates change (Travel Wages) or vessel changes
    useEffect(() => {
        if (!selectedVessel) return;
        
        if (activeTab === 'travel-wages') {
            fetchActiveCrew();
            fetchSavedTravelWagesRecords();
        } else if (activeTab === 'hra') {
            // Always fetch fresh HRA crew (all active members) when switching to HRA tab
            fetchHRACrew();
        }
    }, [travelMonth, selectedVessel, activeTab]);

    // Initialize HRA data when crew changes
    useEffect(() => {
        if (activeTab === 'hra' && crew.length > 0) {
            // Calculate days from current HRA dates
            const totalDays = calculateDaysBetween(hraStartDate, hraEndDate);
            const hraStartDateObj = new Date(hraStartDate);
            const hraEndDateObj = new Date(hraEndDate);
            
            const updated: Record<number, HRAData> = {};
            crew.forEach(member => {
                const signOnDate = member.sign_on_date ? new Date(member.sign_on_date) : null;
                const signOffDate = member.sign_off_date ? new Date(member.sign_off_date) : null;
                
                // Only include crew if they have signed on ON or BEFORE the HRA end date
                if (signOnDate && signOnDate > hraEndDateObj) {
                    return; // Skip crew who haven't joined yet during this entire HRA period
                }
                
                // Only include crew if they haven't been relieved BEFORE the HRA start date
                if (signOffDate && signOffDate < hraStartDateObj) {
                    return; // Skip crew who were relieved before this HRA period starts
                }
                
                // Calculate actual days they are eligible during this HRA period
                let eligibleDays = totalDays;
                
                // If they joined during the HRA period, reduce days before joining
                if (signOnDate && signOnDate > hraStartDateObj && signOnDate <= hraEndDateObj) {
                    const daysBeforeJoin = calculateDaysBetween(hraStartDate, signOnDate.toISOString().split('T')[0]);
                    eligibleDays = Math.max(0, totalDays - daysBeforeJoin);
                }
                
                // If they were relieved during the HRA period, reduce days after relief
                if (signOffDate && signOffDate >= hraStartDateObj && signOffDate < hraEndDateObj) {
                    const daysAfterRelief = calculateDaysBetween(signOffDate.toISOString().split('T')[0], hraEndDate);
                    eligibleDays = Math.max(0, eligibleDays - daysAfterRelief);
                }
                
                const basicSalary = member.basic_salary || 0;
                updated[member.id] = {
                    crew_id: member.id,
                    days: eligibleDays,
                    calculated_amount: calculatePay(basicSalary, eligibleDays)
                };
            });
            setHraData(updated);
        }
    }, [activeTab, crew, hraStartDate, hraEndDate]);

    // Fetch saved HRA records for current month when HRA tab is active
    useEffect(() => {
        if (activeTab === 'hra' && selectedVessel) {
            fetchSavedHRARecords();
        }
    }, [activeTab, selectedVessel, hraStartDate]);

    const fetchActiveCrew = async () => {
        if (!selectedVessel) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/crew?vesselId=${selectedVessel.vessel_id}`,
                {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch crew');

            const allCrew = await response.json();
            
            // Get month and year from travelMonth
            const selectedDateObj = new Date(travelMonth);
            const selectedMonth = selectedDateObj.getMonth();
            const selectedYear = selectedDateObj.getFullYear();
            
            // Filter for crew newly onboarded in the selected month and not yet offboarded
            const travelWagesCrew = allCrew.filter((member: CrewMember) => {
                const signOnDate = member.sign_on_date ? new Date(member.sign_on_date) : null;
                const signOffDate = member.sign_off_date ? new Date(member.sign_off_date) : null;
                
                // Check if signed on in the selected month
                const isOnboardedInMonth = signOnDate && 
                    signOnDate.getMonth() === selectedMonth && 
                    signOnDate.getFullYear() === selectedYear;
                
                // Check if not yet offboarded (or offboard date is in the future)
                const isNotOffboarded = !signOffDate || signOffDate > new Date();
                
                return isOnboardedInMonth && isNotOffboarded;
            });

            setCrew(travelWagesCrew || []);

            // Initialize travel wages data
            const initialData: Record<number, TravelWagesData> = {};
            travelWagesCrew.forEach((member: CrewMember) => {
                initialData[member.id] = {
                    crew_id: member.id,
                    days: 0,
                    calculated_amount: 0
                };
            });
            setTravelWagesData(initialData);
        } catch (error) {
            console.error('Error fetching crew:', error);
            alert('Failed to fetch crew data');
        } finally {
            setLoading(false);
        }
    };

    const fetchHRACrew = async () => {
        if (!selectedVessel) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/crew?vesselId=${selectedVessel.vessel_id}`,
                {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch crew');

            const allCrew = await response.json();
            const today = new Date();
            
            // Filter crew who are currently active (onboarded and not yet offboarded)
            const activeCrew = allCrew.filter((member: CrewMember) => {
                const signOnDate = member.sign_on_date ? new Date(member.sign_on_date) : null;
                const signOffDate = member.sign_off_date ? new Date(member.sign_off_date) : null;
                
                // Crew is active if: signed on and either no sign-off date OR sign-off date is in future
                const isOnboarded = signOnDate && signOnDate <= today;
                const isNotOffboarded = !signOffDate || signOffDate > today;
                
                return isOnboarded && isNotOffboarded;
            });

            setCrew(activeCrew || []);
        } catch (error) {
            console.error('Error fetching HRA crew:', error);
            alert('Failed to fetch crew data');
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedTravelWagesRecords = async () => {
        if (!selectedVessel) return;

        setLoadingSavedTravel(true);
        try {
            // Parse month and year from travelMonth (YYYY-MM-DD format)
            const dateObj = new Date(travelMonth);
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();

            const response = await fetch(
                `/api/travel-wages?vesselId=${selectedVessel.vessel_id}&month=${month}&year=${year}`,
                {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                }
            );

            if (response.ok) {
                const records = await response.json();
                // API already returns formatted records with crew_name, travel_wages_amount, etc.
                setSavedTravelWagesRecords(records || []);
            }
        } catch (error) {
            console.error('Error fetching saved travel wages records:', error);
        } finally {
            setLoadingSavedTravel(false);
        }
    };

    const fetchSavedHRARecords = async () => {
        if (!selectedVessel) return;

        setLoadingSavedHRA(true);
        try {
            // Parse month and year from hraStartDate (YYYY-MM-DD format)
            const dateObj = new Date(hraStartDate);
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();

            const response = await fetch(
                `/api/hra?vesselId=${selectedVessel.vessel_id}&month=${month}&year=${year}`,
                {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                }
            );

            if (response.ok) {
                const records = await response.json();
                // Map API response to display format - use actual period dates from database
                const formattedRecords = records.map((record: any) => ({
                    id: record.id,
                    crew_member_id: record.crew_member_id,
                    crew_name: record.crew_members?.name || `Crew ${record.crew_member_id}`,
                    hra_amount: record.hra_amount,
                    days_calculated: record.days_calculated || 0,
                    hra_period_start: record.hra_period_start || record.hra_date,
                    hra_period_end: record.hra_period_end || record.hra_date
                }));
                setSavedHRARecords(formattedRecords || []);
            }
        } catch (error) {
            console.error('Error fetching saved HRA records:', error);
        } finally {
            setLoadingSavedHRA(false);
        }
    };

    const calculatePay = (basicSalary: number | null, days: number): number => {
        if (!basicSalary || days === 0) return 0;
        return (basicSalary / 30) * days;
    };

    const calculateDaysBetween = (from: string, to: string): number => {
        if (!from || !to) return 0;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const timeDiff = toDate.getTime() - fromDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end date
        return Math.max(0, daysDiff);
    };

    const getCrewStatus = (member: CrewMember): { status: string; label: string; bgColor: string } => {
        const signOnDate = member.sign_on_date ? new Date(member.sign_on_date) : null;
        const signOffDate = member.sign_off_date ? new Date(member.sign_off_date) : null;
        const today = new Date();
        
        if (signOffDate && signOffDate <= today) {
            return { status: 'exit', label: 'Offboarded', bgColor: 'bg-red-100 text-red-800' };
        } else if (signOffDate && signOffDate > today) {
            return { status: 'notice', label: 'Exit Notice', bgColor: 'bg-yellow-100 text-yellow-800' };
        } else if (signOnDate && signOnDate <= today) {
            return { status: 'onboard', label: 'Onboarded', bgColor: 'bg-green-100 text-green-800' };
        } else {
            return { status: 'pending', label: 'Pending', bgColor: 'bg-gray-100 text-gray-800' };
        }
    };

    const handleDaysChange = (crewId: number, days: number) => {
        const crew_member = crew.find(c => c.id === crewId);
        const basicSalary = crew_member?.basic_salary || 0;
        const calculated_amount = calculatePay(basicSalary, days);

        setTravelWagesData(prev => ({
            ...prev,
            [crewId]: {
                crew_id: crewId,
                days,
                calculated_amount
            }
        }));
    };

    const handleSaveTravelWages = async () => {
        if (!selectedVessel) return;

        const payload = Object.values(travelWagesData).filter(d => d.days > 0);

        if (payload.length === 0) {
            alert('Please enter travel wages for at least one crew member');
            return;
        }

        setSavingTravel(true);
        try {
            const response = await fetch('/api/travel-wages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    month: travelMonth,
                    travel_wages: payload
                })
            });

            if (!response.ok) throw new Error('Failed to save travel wages');

            alert('Travel wages saved successfully!');
            setTravelWagesData({});
            // Refresh saved travel wages records
            await fetchSavedTravelWagesRecords();
        } catch (error) {
            console.error('Error saving:', error);
            alert((error as Error).message || 'Failed to save travel wages');
        } finally {
            setSavingTravel(false);
        }
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all travel wages entries?')) {
            const cleared: Record<number, TravelWagesData> = {};
            crew.forEach(member => {
                cleared[member.id] = {
                    crew_id: member.id,
                    days: 0,
                    calculated_amount: 0
                };
            });
            setTravelWagesData(cleared);
        }
    };

    const handleClearHRAAll = () => {
        if (confirm('Are you sure you want to clear all HRA entries?')) {
            const cleared: Record<number, HRAData> = {};
            crew.forEach(member => {
                cleared[member.id] = {
                    crew_id: member.id,
                    days: 0,
                    calculated_amount: 0
                };
            });
            setHraData(cleared);
        }
    };

    const handleDeleteHRA = async (hraEntryId: number) => {
        if (!confirm('Are you sure you want to delete this HRA entry? This will recalculate the monthly HRA total.')) {
            return;
        }

        try {
            const response = await fetch('/api/hra', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: hraEntryId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete HRA entry');
            }

            alert('HRA entry deleted successfully!');
            // Refresh saved HRA records
            await fetchSavedHRARecords();
        } catch (error) {
            console.error('Error deleting HRA entry:', error);
            alert((error as Error).message || 'Failed to delete HRA entry');
        }
    };

    const handleSaveHRA = async () => {
        if (!selectedVessel) return;

        const payload = Object.values(hraData).filter(d => d.days > 0);

        if (payload.length === 0) {
            alert('Please enter HRA for at least one crew member');
            return;
        }

        setSavingHRA(true);
        try {
            // Enhance payload with date range and days information
            const hraStartDateObj = new Date(hraStartDate);
            const hraEndDateObj = new Date(hraEndDate);
            const daysCalculated = calculateDaysBetween(hraStartDate, hraEndDate);
            
            const enhancedPayload = payload.map(p => ({
                ...p,
                hra_period_start: hraStartDate,
                hra_period_end: hraEndDate,
                days_calculated: daysCalculated
            }));

            const response = await fetch('/api/hra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    month: hraStartDate,
                    hra_data: enhancedPayload,
                    hra_end_date: hraEndDate
                })
            });

            if (!response.ok) {
                // Handle specific error cases
                if (response.status === 409) {
                    // Conflict: overlapping dates
                    const errorData = await response.json();
                    alert(
                        errorData.error || 
                        'HRA entry with overlapping dates already exists. Please choose different dates or delete the existing entry first.'
                    );
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save HRA');
                }
                setSavingHRA(false);
                return;
            }

            alert('HRA entries saved successfully!');
            setHraData({});
            // Refresh saved HRA records
            await fetchSavedHRARecords();
        } catch (error) {
            console.error('Error saving:', error);
            alert((error as Error).message || 'Failed to save HRA');
        } finally {
            setSavingHRA(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Wages & HRA Management</h1>
                    <p className="text-gray-600">Manage travel allowances and HRA for active crew members</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('travel-wages')}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === 'travel-wages'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        💰 Travel Wages
                    </button>
                    <button
                        onClick={() => setActiveTab('hra')}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === 'hra'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        ⚠️ HRA (High Risk Area)
                    </button>
                </div>

                {/* Date Selection (Travel Wages) */}
                {activeTab === 'travel-wages' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex gap-4 items-end">
                            <div className="w-2/5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Travel Allowance Month
                                </label>
                                <input
                                    type="date"
                                    value={travelMonth}
                                    onChange={(e) => setTravelMonth(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {selectedVessel && (
                                <div className="flex-1 text-sm text-gray-600">
                                    Vessel: <span className="font-semibold text-gray-900">{selectedVessel.vessel_name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Travel Wages Tab */}
                {activeTab === 'travel-wages' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Travel Wages - {new Date(travelMonth).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                💡 Only for newly onboarded crew in this month. Pay = (Basic Salary / 30) × No. of Days
                            </p>
                        </div>

                        {loading ? (
                            <div className="p-6 text-center text-gray-500">Loading newly onboarded crew...</div>
                        ) : crew.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No newly onboarded crew members found for this month
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full divide-y divide-gray-200">
                                        <thead className="bg-white">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Crew Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Passport No
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rank
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No. of Days
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pay ($)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {crew.map(member => {
                                                const travelData = travelWagesData[member.id];
                                                return (
                                                    <tr key={member.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {member.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {member.passport_number || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {member.rank || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {(() => {
                                                                const status = getCrewStatus(member);
                                                                return (
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor}`}>
                                                                        {status.label}
                                                                    </span>
                                                                );
                                                            })()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <select
                                                                value={travelData?.days || 0}
                                                                onChange={(e) => handleDaysChange(member.id, parseInt(e.target.value) || 0)}
                                                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                                                            >
                                                                {[0, 1, 2, 3, 4].map((day) => (
                                                                    <option key={day} value={day}>
                                                                        {day}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                                            ${(travelData?.calculated_amount && parseFloat(String(travelData.calculated_amount)).toFixed(2)) || '0.00'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Save & Clear Buttons */}
                                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                                    <button
                                        onClick={handleClearAll}
                                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                                    >
                                        ✕ Clear All
                                    </button>
                                    <button
                                        onClick={handleSaveTravelWages}
                                        disabled={savingTravel}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
                                    >
                                        {savingTravel ? '⏳ Saving...' : '💾 Save'}
                                    </button>
                                </div>

                                {/* Saved Travel Wages Records Section */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Travel Wages Records for {new Date(travelMonth).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h3>
                                    
                                    {loadingSavedTravel ? (
                                        <div className="p-6 text-center text-gray-500">Loading saved travel wages records...</div>
                                    ) : savedTravelWagesRecords.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                                            No saved travel wages records for this month
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                                            <table className="w-full">
                                                <thead className="bg-gray-100 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Crew Member</th>
                                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Days</th>
                                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Travel Wages Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {savedTravelWagesRecords.map((record: any) => (
                                                        <tr key={record.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {record.crew_name || record.crew_member_id}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                                                                {record.days_calculated || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                                                ${parseFloat(String(record.travel_wages_amount || 0)).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* HRA Tab */}
                {activeTab === 'hra' && (
                    <>
                        {/* Date Selection (HRA) */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        value={hraStartDate}
                                        onChange={(e) => {
                                            setHraStartDate(e.target.value);
                                            // Auto-update HRA data when dates change
                                            const days = calculateDaysBetween(e.target.value, hraEndDate);
                                            const updated: Record<number, HRAData> = {};
                                            crew.forEach(member => {
                                                const basicSalary = member.basic_salary || 0;
                                                updated[member.id] = {
                                                    crew_id: member.id,
                                                    days,
                                                    calculated_amount: calculatePay(basicSalary, days)
                                                };
                                            });
                                            setHraData(updated);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        value={hraEndDate}
                                        onChange={(e) => {
                                            setHraEndDate(e.target.value);
                                            // Auto-update HRA data when dates change
                                            const days = calculateDaysBetween(hraStartDate, e.target.value);
                                            const updated: Record<number, HRAData> = {};
                                            crew.forEach(member => {
                                                const basicSalary = member.basic_salary || 0;
                                                updated[member.id] = {
                                                    crew_id: member.id,
                                                    days,
                                                    calculated_amount: calculatePay(basicSalary, days)
                                                };
                                            });
                                            setHraData(updated);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {selectedVessel && (
                                    <div className="text-sm text-gray-600">
                                        Vessel: <span className="font-semibold text-gray-900">{selectedVessel.vessel_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* HRA Tab Content */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">⚠️ HRA - High Risk Area ({hraStartDate} to {hraEndDate})</h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-sm text-gray-600">
                                        💡 HRA = (Basic Salary / 30) × No. of Days
                                    </p>
                                    <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-1">
                                        <span className="text-sm font-semibold text-blue-900">
                                            Days Calculated: <span className="text-lg text-blue-700">{calculateDaysBetween(hraStartDate, hraEndDate)}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-6 text-center text-gray-500">Loading active crew...</div>
                            ) : crew.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No active crew members found
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full divide-y divide-gray-200">
                                            <thead className="bg-white">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Crew Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Passport No
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Rank
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        No. of Days
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Basic ($)
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        HRA ($)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {crew.map(member => {
                                                    const hraInfo = hraData[member.id];
                                                    // Skip crew members not eligible for this HRA period
                                                    if (!hraInfo) return null;
                                                    
                                                    return (
                                                        <tr key={member.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {member.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                {member.passport_number || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                {member.rank || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                                                                {hraInfo?.days || 0}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                                                ${(member.basic_salary && parseFloat(String(member.basic_salary)).toFixed(2)) || '0.00'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                                                ${(hraInfo?.calculated_amount && parseFloat(String(hraInfo.calculated_amount)).toFixed(2)) || '0.00'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Save & Clear Buttons */}
                                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                                        <button
                                            onClick={handleClearHRAAll}
                                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                                        >
                                            ✕ Clear All
                                        </button>
                                        <button
                                            onClick={handleSaveHRA}
                                            disabled={savingHRA}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
                                        >
                                            {savingHRA ? '⏳ Saving...' : '💾 Save'}
                                        </button>
                                    </div>

                                    {/* Saved HRA Records Section */}
                                    <div className="mt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Saved HRA Records for Current Month</h3>
                                        
                                        {loadingSavedHRA ? (
                                            <div className="p-6 text-center text-gray-500">Loading saved HRA records...</div>
                                        ) : savedHRARecords.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                                                No saved HRA records for this month
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                                <table className="w-full">
                                                    <thead className="bg-gray-100 border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Crew Member</th>
                                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date Range</th>
                                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Days</th>
                                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">HRA Amount</th>
                                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {savedHRARecords.map((record: any) => {
                                                            // Fallback: calculate days from date range if not stored
                                                            const displayDays = record.days_calculated && record.days_calculated > 0 
                                                                ? record.days_calculated 
                                                                : calculateDaysBetween(
                                                                    new Date(record.hra_period_start).toISOString().split('T')[0],
                                                                    new Date(record.hra_period_end).toISOString().split('T')[0]
                                                                  );
                                                            
                                                            return (
                                                            <tr key={record.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {record.crew_name || record.crew_member_id}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                    {new Date(record.hra_period_start).toLocaleDateString()} - {new Date(record.hra_period_end).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                                                                    {displayDays}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                                                    ${parseFloat(String(record.hra_amount || 0)).toFixed(2)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                                    <button
                                                                        onClick={() => handleDeleteHRA(record.id)}
                                                                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium transition-colors"
                                                                    >
                                                                        🗑️ Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
