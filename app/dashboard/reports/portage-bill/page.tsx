'use client';

import { useState, useEffect } from 'react';
import { formatDateDDMMYYYY } from '@/lib/formatters';
import { useVessel } from '@/app/context/VesselContext';

interface CrewMember {
    id: number;
    name: string;
    rank: string | null;
    vessel_id: number;
    date_of_birth?: string | null;
    sign_on_date?: string | null;
    sign_off_date?: string | null;
    basic_salary?: number | null;
    fixed_overtime?: number | null;
    leave_wages?: number | null;
    other_allowances?: number | null;
    travel_wages?: number | null;
    hra?: number | null;
    joining_expenses?: number | null;
    onboard_allowance_short_manning?: number | null;
    total_earnings?: number | null;
}

interface CrewEarnings {
    id: number;
    crew_member_id: number;
    basic_salary: number | null;
    fixed_overtime: number | null;
    leave_wages: number | null;
    other_allowances: number | null;
    travel_wages: number | null;
    hra: number | null;
    joining_expenses: number | null;
    onboard_allowance_short_manning: number | null;
    total_earnings: number | null;
    cash_drawn: number | null;
    home_allowance: number | null;
    bond_deduction: number | null;
    other_deduction: number | null;
    brought_forward: number | null;
}

interface CrewWithEarnings extends CrewMember {
    earnings?: CrewEarnings;
}

interface VesselData {
    id: number;
    vessel_name: string;
}

export default function PortageBill() {
    const { selectedVessel } = useVessel();
    const [crewData, setCrewData] = useState<CrewWithEarnings[]>([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [editValues, setEditValues] = useState<Record<number | string, {
        cash_drawn: string;
        home_allowance: string;
        other_deduction: string;
        travel_wages: string;
        joining_expenses: string;
        hra: string;
    }>>({});
    const [validationErrors, setValidationErrors] = useState<Record<number | string, string[]>>({});

    // Helper function to determine if this is the first month for a crew member
    const isFirstMonth = (signOnDate: string | null | undefined): boolean => {
        if (!signOnDate || !month || !year) return false;
        const signOn = new Date(signOnDate);
        const signOnMonth = signOn.getMonth() + 1;
        const signOnYear = signOn.getFullYear();
        return signOnMonth === parseInt(month) && signOnYear === parseInt(year);
    };

    // Helper function to validate crew member age (basic check)
    const validateAge = (member: CrewWithEarnings): { valid: boolean; error?: string } => {
        if (!member.date_of_birth) {
            return { valid: true }; // No validation if no DOB
        }
        
        const dob = new Date(member.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        // Basic age validation - crew members should be at least 18
        if (age < 18) {
            return { valid: false, error: `Crew member is ${age} years old. Minimum age requirement is 18 years.` };
        }
        
        return { valid: true };
    };

    // Validation Functions
    const validateDeductionValue = (value: string): { valid: boolean; error?: string } => {
        if (!value || value.trim() === '') return { valid: true }; // Empty is allowed
        
        const num = parseFloat(value);
        
        // Check if it's a valid number
        if (isNaN(num)) {
            return { valid: false, error: 'Must be a valid number' };
        }
        
        // Check for negative values
        if (num < 0) {
            return { valid: false, error: 'Deduction cannot be negative' };
        }
        
        // Check decimal places (max 2)
        if (!/^\d+(\.\d{0,2})?$/.test(value)) {
            return { valid: false, error: 'Maximum 2 decimal places allowed' };
        }
        
        return { valid: true };
    };

    const validateDeductions = (member: CrewWithEarnings, cashDrawn: string, homeAllowance: string, otherDeduction: string): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];
        
        // Validate individual fields
        const cashError = validateDeductionValue(cashDrawn);
        if (!cashError.valid) errors.push(`Cash Drawn: ${cashError.error}`);
        
        const homeError = validateDeductionValue(homeAllowance);
        if (!homeError.valid) errors.push(`Home Allowance: ${homeError.error}`);
        
        const otherError = validateDeductionValue(otherDeduction);
        if (!otherError.valid) errors.push(`Other Deduction: ${otherError.error}`);
        
        // Calculate total deductions
        const cash = parseFloat(cashDrawn || '0');
        const home = parseFloat(homeAllowance || '0');
        const bond = member.earnings?.bond_deduction || 0;
        const other = parseFloat(otherDeduction || '0');
        const totalDeductions = cash + home + parseFloat(String(bond)) + other;
        
        // Check if total deductions exceed total earnings - this will be checked after calculateTotalEarnings is defined
        return {
            valid: errors.length === 0,
            errors
        };
    };

    const calculateFMTODays = (member: CrewWithEarnings): { fm: number; to: number; days: number } => {
        const currentMonth = parseInt(month);
        const currentYear = parseInt(year);
        
        // Check if crew member is new (joined in current month)
        let isNewJoiner = false;
        if (member.sign_on_date) {
            const signOnDate = new Date(member.sign_on_date);
            const signOnMonth = signOnDate.getMonth() + 1;
            const signOnYear = signOnDate.getFullYear();
            
            if (signOnMonth === currentMonth && signOnYear === currentYear) {
                isNewJoiner = true;
            }
        }

        // Check if crew member is relieved (signed off in current month)
        let isRelieved = false;
        let signOffDay = 31;
        if (member.sign_off_date) {
            const signOffDate = new Date(member.sign_off_date);
            const signOffMonth = signOffDate.getMonth() + 1;
            const signOffYear = signOffDate.getFullYear();
            
            if (signOffMonth === currentMonth && signOffYear === currentYear) {
                isRelieved = true;
                signOffDay = signOffDate.getDate();
            }
        }

        let fm = 1;
        let to = 31;
        let days = 30;

        if (isNewJoiner) {
            // New joiner: FM = joining day, TO = 31, Days = TO - FM
            if (member.sign_on_date) {
                const signOnDate = new Date(member.sign_on_date);
                fm = signOnDate.getDate();
                to = 31;
                days = to - fm;
            }
        } else if (isRelieved) {
            // Relieved crew: FM = 1, TO = sign-off day, Days = TO - FM
            fm = 1;
            to = signOffDay;
            days = to - fm;
        } else {
            // Old active crew: FM = 1, TO = 31, Days = 30
            fm = 1;
            to = 31;
            days = 30;
        }

        return { fm, to, days };
    };

    useEffect(() => {
        // Set default current month/year
        const now = new Date();
        setMonth(String(now.getMonth() + 1).padStart(2, '0'));
        setYear(String(now.getFullYear()));
    }, []);

    useEffect(() => {
        if (selectedVessel && month && year) {
            // Check if the selected month/year is in the future
            const selectedDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const today = new Date();
            const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            if (selectedDate > currentMonthEnd) {
                alert('Cannot generate Portage Bill for future dates. Please select current or past month.');
                setCrewData([]);
                setEditValues({});
                return;
            }
            
            fetchCrewData();
        }
    }, [selectedVessel, month, year]);

    const fetchCrewData = async () => {
        try {
            setLoading(true);
            if (!selectedVessel) return;

            // Fetch crew with earnings and slopchest deductions
            const crewRes = await fetch(
                `/api/crew/earnings-with-slopchest?month=${month}&year=${year}`,
                {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                }
            );
            
            if (!crewRes.ok) {
                const errorData = await crewRes.json();
                console.error('Crew API Error:', errorData);
                throw new Error(`Failed to fetch crew: ${errorData.details || errorData.error}`);
            }
            
            const crewWithEarnings: CrewWithEarnings[] = await crewRes.json();
            setCrewData(crewWithEarnings);
            
            // Initialize edit values for all crew members
            const newEditValues: Record<number | string, any> = {};
            
            crewWithEarnings.forEach((member: CrewWithEarnings) => {
                const earning = member.earnings;
                const firstMonth = isFirstMonth(member.sign_on_date);
                
                const earningId = earning?.id || `crew_${member.id}`;
                newEditValues[earningId] = {
                    cash_drawn: String(earning?.cash_drawn || ''),
                    home_allowance: String(earning?.home_allowance || ''),
                    other_deduction: String(earning?.other_deduction || ''),
                    // Travel Wages: editable only in first month
                    travel_wages: String(earning?.travel_wages || (firstMonth ? '' : (member.travel_wages || ''))),
                    // Joining Expenses: editable only in first month
                    joining_expenses: String(earning?.joining_expenses || (firstMonth ? '' : (member.joining_expenses || ''))),
                    // HRA: always editable
                    hra: String(earning?.hra || (member.hra || '')),
                };
            });
            
            setEditValues(newEditValues);
        } catch (error) {
            console.error('Error fetching crew data:', error);
            alert(`Error loading portage bill: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const updateFieldValue = (earningId: number | string | null, field: string, value: string) => {
        if (!earningId) return;
        
        // Validate the field value
        const fieldError = validateDeductionValue(value);
        
        // Update validation errors
        setValidationErrors(prev => {
            const errors = prev[earningId] || [];
            const otherErrors = errors.filter(e => !e.includes(field.replace(/_/g, ' ')));
            
            if (!fieldError.valid) {
                return {
                    ...prev,
                    [earningId]: [...otherErrors, `${field.replace(/_/g, ' ')}: ${fieldError.error}`]
                };
            } else {
                return {
                    ...prev,
                    [earningId]: otherErrors.length > 0 ? otherErrors : []
                };
            }
        });

        setEditValues(prev => ({
            ...prev,
            [earningId]: {
                cash_drawn: prev[earningId]?.cash_drawn ?? '',
                home_allowance: prev[earningId]?.home_allowance ?? '',
                other_deduction: prev[earningId]?.other_deduction ?? '',
                travel_wages: prev[earningId]?.travel_wages ?? '',
                joining_expenses: prev[earningId]?.joining_expenses ?? '',
                hra: prev[earningId]?.hra ?? '',
                [field]: value,
            }
        }));
    };

    const saveEarnings = async (earningId: number | string | null) => {
        if (!earningId || !selectedVessel) return;

        try {
            const values = editValues[earningId];
            if (!values) {
                alert('No values found for editing. Please refresh and try again.');
                return;
            }
            
            // Find the crew member
            const member = crewData.find(m => {
                if (typeof earningId === 'string' && earningId.startsWith('crew_')) {
                    return m.id === parseInt(earningId.replace('crew_', ''));
                }
                return m.earnings?.id === earningId;
            });

            if (!member) {
                alert('Crew member not found');
                return;
            }

            // Validate deductions
            const validation = validateDeductions(member, values.cash_drawn || '', values.home_allowance || '', values.other_deduction || '');
            if (!validation.valid) {
                alert('Validation Errors:\n\n' + validation.errors.join('\n'));
                return;
            }

            // Additional check: ensure total deductions don't exceed total earnings
            const totalEarnings = (member.basic_salary || 0) + 
                                 (member.fixed_overtime || 0) + 
                                 (member.leave_wages || 0) + 
                                 (member.other_allowances || 0) + 
                                 (values?.travel_wages ? parseFloat(values.travel_wages) : (member.earnings?.travel_wages || 0)) + 
                                 (values?.hra ? parseFloat(values.hra) : (member.earnings?.hra || 0)) + 
                                 (values?.joining_expenses ? parseFloat(values.joining_expenses) : (member.earnings?.joining_expenses || 0)) + 
                                 (member.earnings?.onboard_allowance_short_manning || 0);
            
            const cash = parseFloat(values.cash_drawn || '0');
            const home = parseFloat(values.home_allowance || '0');
            const bond = member.earnings?.bond_deduction || 0;
            const other = parseFloat(values.other_deduction || '0');
            const totalDeductions = cash + home + bond + other;
            
            if (totalDeductions > totalEarnings) {
                alert(`Validation Error:\n\nTotal Deductions (${totalDeductions.toFixed(2)}) cannot exceed Total Earnings (${totalEarnings.toFixed(2)})`);
                return;
            }

            // Check if values have changed
            const hasChanges = 
                values.cash_drawn !== String(member.earnings?.cash_drawn || '') ||
                values.home_allowance !== String(member.earnings?.home_allowance || '') ||
                values.other_deduction !== String(member.earnings?.other_deduction || '') ||
                values.travel_wages !== String(member.earnings?.travel_wages || '') ||
                values.joining_expenses !== String(member.earnings?.joining_expenses || '') ||
                values.hra !== String(member.earnings?.hra || '');

            if (!hasChanges) {
                alert('No changes detected. Please modify values before saving.');
                setEditingId(null);
                return;
            }
            
            // If it's a new record (string ID from crew_X format), extract crew_member_id
            const isNewRecord = typeof earningId === 'string' && earningId.startsWith('crew_');
            const crewMemberId = isNewRecord ? parseInt(earningId.replace('crew_', '')) : null;
            
            let response;
            if (isNewRecord) {
                // Create new earnings record
                const createPayload = {
                    crew_member_id: crewMemberId,
                    month: parseInt(month),
                    year: parseInt(year),
                    cash_drawn: parseFloat(values.cash_drawn) || 0,
                    home_allowance: parseFloat(values.home_allowance) || 0,
                    other_deduction: parseFloat(values.other_deduction) || 0,
                };
                console.log('Creating earnings with payload:', createPayload);
                response = await fetch(`/api/crew/earnings`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    },
                    body: JSON.stringify(createPayload),
                });
            } else {
                // Update existing earnings record
                const updatePayload = {
                    cash_drawn: parseFloat(values.cash_drawn) || 0,
                    home_allowance: parseFloat(values.home_allowance) || 0,
                    other_deduction: parseFloat(values.other_deduction) || 0,
                    travel_wages: values.travel_wages ? parseFloat(values.travel_wages) : undefined,
                    joining_expenses: values.joining_expenses ? parseFloat(values.joining_expenses) : undefined,
                    hra: values.hra ? parseFloat(values.hra) : undefined,
                };
                console.log('Updating earnings with payload:', updatePayload);
                response = await fetch(`/api/crew/earnings/${earningId}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    },
                    body: JSON.stringify(updatePayload),
                });
            }

            if (!response.ok) {
                let errorMessage = 'Failed to update earnings';
                try {
                    const errorData = await response.json();
                    console.error('Server error response:', errorData);
                    errorMessage = errorData.details || errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    console.error('Response status:', response.status, response.statusText);
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            const responseData = await response.json();
            console.log('Success response:', responseData);

            alert('Earnings updated successfully');
            setEditingId(null);
            // Refresh data to get updated earnings
            fetchCrewData();
        } catch (error) {
            console.error('Error saving earnings:', error);
            alert(`Error saving earnings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const cancelEarnings = (earningId: number | string | null) => {
        setEditingId(null);
    };

    const getMonthName = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(month) - 1] || '';
    };

    const getRankCategory = (rank: string | null | undefined): 'OFFICERS' | 'RATINGS' | 'OTHERS' => {
        if (!rank) return 'OTHERS';
        const officerRanks = ['Master', 'Chief Officer', 'Chief Engineer', '2nd Officer', '3rd Officer', '2nd Engineer', '3rd Engineer', 'Admin', 'Captain', 'CAPT', 'CHOE', 'SECOFF', 'CMO'];
        return officerRanks.some(r => rank.toLowerCase().includes(r.toLowerCase())) ? 'OFFICERS' : 'RATINGS';
    };

    const getCrewStatus = (member: CrewWithEarnings): 'ACTIVE' | 'RELIEVED' => {
        if (!member.sign_off_date) return 'ACTIVE';
        
        const signOffDate = new Date(member.sign_off_date);
        const signOffMonth = signOffDate.getMonth() + 1;
        const signOffYear = signOffDate.getFullYear();
        
        // If signed off in current month/year, they are relieved
        if (signOffMonth === parseInt(month) && signOffYear === parseInt(year)) {
            return 'RELIEVED';
        }
        
        // If signed off before current month, they're relieved (not shown or in relieved section)
        if (signOffYear < parseInt(year) || (signOffYear === parseInt(year) && signOffMonth < parseInt(month))) {
            return 'RELIEVED';
        }
        
        return 'ACTIVE';
    };

    const groupedCrew = crewData.reduce((acc, member) => {
        const status = getCrewStatus(member);
        const category = status === 'ACTIVE' ? 'ACTIVE' : 'RELIEVED';
        if (!acc[category]) acc[category] = [];
        acc[category].push(member);
        return acc;
    }, {} as Record<string, CrewWithEarnings[]>);

    const calculateTotalDeductions = (member: CrewWithEarnings, customValues?: any): number => {
        const values = customValues || editValues[member.earnings?.id || `crew_${member.id}`];
        const cash = values?.cash_drawn || member.earnings?.cash_drawn || 0;
        const home = values?.home_allowance || member.earnings?.home_allowance || 0;
        const bond = member.earnings?.bond_deduction || 0;
        const other = values?.other_deduction || member.earnings?.other_deduction || 0;
        return parseFloat(String(cash)) + parseFloat(String(home)) + parseFloat(String(bond)) + parseFloat(String(other));
    };

    const calculateTotalEarnings = (member: CrewWithEarnings, customValues?: any): number => {
        const values = customValues || editValues[member.earnings?.id || `crew_${member.id}`];
        // Total Earnings = Basic + Fixed OT + Leave Wages + Other Allowance + Travel wages + HRA + Joining Exp + Onboard allowance
        const basic = parseFloat(String(member.basic_salary || 0));
        const fixedOT = parseFloat(String(member.fixed_overtime || 0));
        const leaveWages = parseFloat(String(member.leave_wages || 0));
        const otherAllowance = parseFloat(String(member.other_allowances || 0));
        const travelWages = parseFloat(String(values?.travel_wages || member.earnings?.travel_wages || 0));
        const hra = parseFloat(String(values?.hra || member.earnings?.hra || 0));
        const joiningExp = parseFloat(String(values?.joining_expenses || member.earnings?.joining_expenses || 0));
        const onboardAllowance = parseFloat(String(member.earnings?.onboard_allowance_short_manning || 0));
        
        return basic + fixedOT + leaveWages + otherAllowance + travelWages + hra + joiningExp + onboardAllowance;
    };

    const calculateFinalBalance = (member: CrewWithEarnings, customValues?: any): number => {
        const totalEarnings = calculateTotalEarnings(member, customValues);
        const totalDeductions = calculateTotalDeductions(member, customValues);
        return totalEarnings - totalDeductions;
    };

    const renderCrew = (category: string, members: CrewWithEarnings[], startingNumber: number) => {
        return members.map((member, index) => {
            const earningId = member.earnings?.id || `crew_${member.id}`;
            const values = editValues[earningId] || { 
                cash_drawn: '', 
                home_allowance: '', 
                other_deduction: '',
                travel_wages: '',
                joining_expenses: '',
                hra: ''
            };
            const isEditing = editingId === earningId;
            const fmToDays = calculateFMTODays(member);
            const firstMonth = isFirstMonth(member.sign_on_date);
            
            // Get display values - prioritize earnings record, then crew_member for non-calculated fields
            const getDisplayValue = (earningValue: any, memberValue: any, defaultValue: string = '0'): string => {
                if (earningValue !== null && earningValue !== undefined && earningValue !== '') {
                    return String(earningValue);
                }
                return String(memberValue || defaultValue);
            };
            
            return (
                <tr key={member.id} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 px-2 py-1 text-sm font-medium">{startingNumber + index}</td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm">{member.name}</td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm">{member.rank || '-'}</td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-center">{fmToDays.fm}</td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-center">{fmToDays.to}</td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-center">{fmToDays.days}</td>
                    {/* Basic Salary - from crew_member, read-only */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right font-medium">{parseFloat(String(member.basic_salary || 0)).toFixed(2)}</td>
                    {/* Fixed OT - from crew_member, read-only */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right">{parseFloat(String(member.fixed_overtime || 0)).toFixed(2)}</td>
                    {/* Leave Wages - from crew_member, read-only */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right">{parseFloat(String(member.leave_wages || 0)).toFixed(2)}</td>
                    {/* Other Allowances - from crew_member, read-only */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right">{parseFloat(String(member.other_allowances || 0)).toFixed(2)}</td>
                    
                    {/* Travel Wages - editable only in first month */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right" style={{backgroundColor: firstMonth ? '#E0F2FE' : 'white'}}>
                        {firstMonth ? (
                            <input
                                type="number"
                                step="0.01"
                                value={values.travel_wages}
                                onChange={(e) => updateFieldValue(earningId, 'travel_wages', e.target.value)}
                                onFocus={() => setEditingId(earningId)}
                                className="w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400"
                            />
                        ) : (
                            <div className="px-1 py-1">{parseFloat(getDisplayValue(member.earnings?.travel_wages, member.travel_wages)).toFixed(2)}</div>
                        )}
                    </td>
                    
                    {/* HRA - always editable */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right" style={{backgroundColor: '#FEF3C7'}}>
                        <input
                            type="number"
                            step="0.01"
                            value={values.hra}
                            onChange={(e) => updateFieldValue(earningId, 'hra', e.target.value)}
                            onFocus={() => setEditingId(earningId)}
                            className="w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    
                    {/* Joining Expenses - editable only in first month */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right" style={{backgroundColor: firstMonth ? '#E0F2FE' : 'white'}}>
                        {firstMonth ? (
                            <input
                                type="number"
                                step="0.01"
                                value={values.joining_expenses}
                                onChange={(e) => updateFieldValue(earningId, 'joining_expenses', e.target.value)}
                                onFocus={() => setEditingId(earningId)}
                                className="w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400"
                            />
                        ) : (
                            <div className="px-1 py-1">{parseFloat(getDisplayValue(member.earnings?.joining_expenses, member.joining_expenses)).toFixed(2)}</div>
                        )}
                    </td>
                    
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right">{parseFloat(String(member.earnings?.onboard_allowance_short_manning || 0)).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right font-semibold bg-gray-200">{calculateTotalEarnings(member).toFixed(2)}</td>
                    
                    {/* Deductions - Always Editable Text Boxes */}
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right bg-blue-50">
                        <input
                            type="number"
                            step="0.01"
                            value={values.cash_drawn}
                            onChange={(e) => updateFieldValue(earningId, 'cash_drawn', e.target.value)}
                            onFocus={() => setEditingId(earningId)}
                            className="w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right bg-blue-50">
                        <input
                            type="number"
                            step="0.01"
                            value={values.home_allowance}
                            onChange={(e) => updateFieldValue(earningId, 'home_allowance', e.target.value)}
                            onFocus={() => setEditingId(earningId)}
                            className="w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td 
                        className="border-r border-gray-300 px-2 py-1 text-sm text-right bg-blue-50 cursor-help hover:bg-blue-100"
                        title={`Slopchest Deduction: ₹${parseFloat(String((member as any).slopchest_deduction || 0)).toFixed(2)}`}
                    >
                        {parseFloat(String(member.earnings?.bond_deduction || 0)).toFixed(2)}
                    </td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right bg-blue-50">
                        <input
                            type="number"
                            step="0.01"
                            value={values.other_deduction}
                            onChange={(e) => updateFieldValue(earningId, 'other_deduction', e.target.value)}
                            onFocus={() => setEditingId(earningId)}
                            className="w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right font-semibold bg-blue-50">
                        {calculateTotalDeductions(member).toFixed(2)}
                    </td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right">{parseFloat(String(member.earnings?.brought_forward || 0)).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-2 py-1 text-sm text-right font-bold bg-gray-300">
                        {calculateFinalBalance(member).toFixed(2)}
                    </td>
                    
                    {/* Action Buttons */}
                    <td className="px-2 py-1 text-sm text-center">
                        {isEditing ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-1 justify-center">
                                    <button
                                        onClick={() => saveEarnings(earningId)}
                                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            cancelEarnings(earningId);
                                            setValidationErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors[earningId || ''];
                                                return newErrors;
                                            });
                                        }}
                                        className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {validationErrors[earningId] && validationErrors[earningId].length > 0 && (
                                    <div className="text-xs text-red-600 bg-red-50 p-1 rounded border border-red-200">
                                        {validationErrors[earningId].map((err, idx) => (
                                            <div key={idx}>{err}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-400 text-xs">Ready</span>
                        )}
                    </td>
                </tr>
            );
        });
    };

    const calculateCategoryTotals = (members: CrewWithEarnings[]) => {
        return {
            basic: members.reduce((sum, m) => sum + (parseFloat(String(m.basic_salary || 0))), 0),
            fixedOT: members.reduce((sum, m) => sum + (parseFloat(String(m.fixed_overtime || 0))), 0),
            leaveWages: members.reduce((sum, m) => sum + (parseFloat(String(m.leave_wages || 0))), 0),
            otherAllowances: members.reduce((sum, m) => sum + (parseFloat(String(m.other_allowances || 0))), 0),
            travelWages: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.travel_wages || 0))), 0),
            hra: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.hra || 0))), 0),
            joiningExp: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.joining_expenses || 0))), 0),
            onboardAllowance: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.onboard_allowance_short_manning || 0))), 0),
            totalEarnings: members.reduce((sum, m) => sum + calculateTotalEarnings(m), 0),
            cashDrawn: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.cash_drawn || 0))), 0),
            homeAllowance: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.home_allowance || 0))), 0),
            bondDeduction: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.bond_deduction || 0))), 0),
            otherDeduction: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.other_deduction || 0))), 0),
            totalDeductions: members.reduce((sum, m) => sum + parseFloat(String(calculateTotalDeductions(m))), 0),
            broughtForward: members.reduce((sum, m) => sum + (parseFloat(String(m.earnings?.brought_forward || 0))), 0),
            finalBalance: members.reduce((sum, m) => sum + parseFloat(String(calculateFinalBalance(m))), 0),
        };
    };

    const activeTotals = calculateCategoryTotals(groupedCrew['ACTIVE'] || []);
    const relievedTotals = calculateCategoryTotals(groupedCrew['RELIEVED'] || []);
    const activeMembers = groupedCrew['ACTIVE'] || [];
    const relievedMembers = groupedCrew['RELIEVED'] || [];

    if (!selectedVessel) {
        return (
            <div className="space-y-6 p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">Please select a vessel from the dashboard header to view the Portage Bill.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Portage Bill Report</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(String(parseInt(e.target.value) || 0).padStart(2, '0'))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Portage Bill Table */}
            {!loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs">
                            {/* Title */}
                            <thead>
                                <tr>
                                    <td colSpan={24} className="text-center font-bold text-lg py-3 bg-blue-600 text-white border border-gray-400">
                                        {selectedVessel.vessel_name} - PORTAGE BILL - MONTH OF {getMonthName()}-{year.slice(-2)}
                                    </td>
                                </tr>
                            </thead>
                        </table>

                        {/* Column Headers */}
                        <table className="w-full border-collapse text-xs">
                            <thead>
                                {/* Section Headers */}
                                <tr className="bg-gray-500 text-white border border-gray-400">
                                    <th colSpan={6} className="border-r border-gray-300 px-2 py-2 font-bold"></th>
                                    <th colSpan={9} className="text-center border-r border-gray-300 px-2 py-2 font-bold">E A R N I N G S</th>
                                    <th colSpan={7} className="text-center border-r border-gray-300 px-2 py-2 font-bold">D E D U C T I O N S</th>
                                    <th className="px-2 py-2 font-bold"></th>
                                </tr>
                                {/* Column Headers */}
                                <tr className="bg-gray-600 text-white border border-gray-400">
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">SR. NO.</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">NAME</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">RANK</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">FM</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">TO</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">DAYS</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">BASIC</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">FIXED OT</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">LEAVE WAGES</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">OTHER ALLOWANCES</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">Travel Wages</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">HRA</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">JOINING EXPENSES</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">ONBOARD ALLOWANCE / SHORT MANNING</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">TOTAL EARNINGS</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">CASH DRAWN ON</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">HOME ALLOWANCE</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">BOND</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">OTHER DEDUCTION</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">TOTAL DEDUCTION</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">BROUGHT FORWARD</th>
                                    <th className="border-r border-gray-300 px-2 py-2 font-bold">FINAL BALANCE</th>
                                </tr>
                            </thead>

                            {/* Active Crew Section */}
                            <tbody>
                                {renderCrew('ACTIVE', activeMembers, 1)}
                                
                                {/* Active Crew Totals */}
                                <tr className="bg-gray-300 font-bold border border-gray-300">
                                    <td colSpan={6} className="border-r border-gray-300 px-2 py-2 text-right">TOTAL (A)</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.basic.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.fixedOT.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.leaveWages.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.otherAllowances.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.travelWages.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.hra.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.joiningExp.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.onboardAllowance.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.totalEarnings.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.cashDrawn.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.homeAllowance.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.bondDeduction.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.otherDeduction.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.totalDeductions.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.broughtForward.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{activeTotals.finalBalance.toFixed(2)}</td>
                                    <td className="px-2 py-2"></td>
                                </tr>

                                {/* Relieved Crew Section */}
                                {renderCrew('RELIEVED', relievedMembers, (activeMembers.length + 1))}
                                
                                {/* Relieved Crew Totals */}
                                <tr className="bg-gray-300 font-bold border border-gray-300">
                                    <td colSpan={6} className="border-r border-gray-300 px-2 py-2 text-right">TOTAL (B)</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.basic.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.fixedOT.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.leaveWages.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.otherAllowances.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.travelWages.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.hra.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.joiningExp.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.onboardAllowance.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.totalEarnings.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.cashDrawn.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.homeAllowance.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.bondDeduction.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.otherDeduction.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.totalDeductions.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.broughtForward.toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{relievedTotals.finalBalance.toFixed(2)}</td>
                                    <td className="px-2 py-2"></td>
                                </tr>

                                {/* Grand Totals */}
                                <tr className="bg-gray-400 text-white font-bold border border-gray-300">
                                    <td colSpan={6} className="border-r border-gray-300 px-2 py-2 text-right">TOTAL (A+B)</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.basic + relievedTotals.basic).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.fixedOT + relievedTotals.fixedOT).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.leaveWages + relievedTotals.leaveWages).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.otherAllowances + relievedTotals.otherAllowances).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.travelWages + relievedTotals.travelWages).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.hra + relievedTotals.hra).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.joiningExp + relievedTotals.joiningExp).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.onboardAllowance + relievedTotals.onboardAllowance).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.totalEarnings + relievedTotals.totalEarnings).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.cashDrawn + relievedTotals.cashDrawn).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.homeAllowance + relievedTotals.homeAllowance).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.bondDeduction + relievedTotals.bondDeduction).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.otherDeduction + relievedTotals.otherDeduction).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.totalDeductions + relievedTotals.totalDeductions).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.broughtForward + relievedTotals.broughtForward).toFixed(2)}</td>
                                    <td className="border-r border-gray-300 px-2 py-2 text-right">{(activeTotals.finalBalance + relievedTotals.finalBalance).toFixed(2)}</td>
                                    <td className="px-2 py-2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Print Button */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
                        >
                            🖨️ Print Report
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="text-center py-12 text-gray-500">
                    Loading crew data...
                </div>
            )}
        </div>
    );
}
