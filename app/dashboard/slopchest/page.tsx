'use client';

import { useState, useEffect } from 'react';
import { useVessel } from '@/app/context/VesselContext';
import SlopchestQuickEntry from '@/components/slopchest/SlopchestQuickEntry';
import SlopchestSummary from '@/components/slopchest/SlopchestSummary';
import SlopchestOnSigners from '@/components/slopchest/SlopchestOnSigners';

export default function SlopchestPage() {
    const { selectedVessel } = useVessel();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState<'crew' | 'on-signers'>('crew');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    if (!selectedVessel) {
        return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">Please select a vessel to view slopchest deductions.</p>
            </div>
        );
    }

    const handleEntryAdded = () => {
        // Trigger refresh of summary table
        setRefreshTrigger(prev => prev + 1);
    };

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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Slopchest Deductions</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Vessel: <span className="font-semibold">{selectedVessel.vessel_name}</span>
                    </p>
                </div>
                
                {/* Month/Year Navigation */}
                <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <button
                        onClick={previousMonth}
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        ← Previous
                    </button>
                    <span className="text-sm font-semibold text-gray-900 min-w-[150px] text-center">
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

            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('crew')}
                    className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'crew'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Crew Deductions
                </button>
                <button
                    onClick={() => setActiveTab('on-signers')}
                    className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'on-signers'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Owners/charterer
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Quick Entry Form - Left Side */}
                <div className="lg:col-span-1">
                    <SlopchestQuickEntry
                        vesselId={selectedVessel.vessel_id}
                        month={currentMonth}
                        year={currentYear}
                        activeTab={activeTab}
                        onEntryAdded={handleEntryAdded}
                    />
                </div>

                {/* Summary Table - Right Side */}
                <div className="lg:col-span-3">
                    {activeTab === 'crew' ? (
                        <SlopchestSummary
                            vesselId={selectedVessel.vessel_id}
                            month={currentMonth}
                            year={currentYear}
                            refreshTrigger={refreshTrigger}
                        />
                    ) : (
                        <SlopchestOnSigners
                            vesselId={selectedVessel.vessel_id}
                            month={currentMonth}
                            year={currentYear}
                            refreshTrigger={refreshTrigger}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
