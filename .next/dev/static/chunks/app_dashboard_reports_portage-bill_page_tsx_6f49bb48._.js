(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/reports/portage-bill/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PortageBill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$VesselContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/context/VesselContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function PortageBill() {
    _s();
    const { selectedVessel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$VesselContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVessel"])();
    const [crewData, setCrewData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [year, setYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editValues, setEditValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [validationErrors, setValidationErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [finalizedRecords, setFinalizedRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Helper function to determine if this is the first month for a crew member
    const isFirstMonth = (signOnDate)=>{
        if (!signOnDate || !month || !year) return false;
        const signOn = new Date(signOnDate);
        const signOnMonth = signOn.getMonth() + 1;
        const signOnYear = signOn.getFullYear();
        return signOnMonth === parseInt(month) && signOnYear === parseInt(year);
    };
    // Helper function to validate crew member age (basic check)
    const validateAge = (member)=>{
        if (!member.date_of_birth) {
            return {
                valid: true
            }; // No validation if no DOB
        }
        const dob = new Date(member.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || monthDiff === 0 && today.getDate() < dob.getDate()) {
            age--;
        }
        // Basic age validation - crew members should be at least 18
        if (age < 18) {
            return {
                valid: false,
                error: `Crew member is ${age} years old. Minimum age requirement is 18 years.`
            };
        }
        return {
            valid: true
        };
    };
    // Validation Functions
    const validateDeductionValue = (value)=>{
        if (!value || value.trim() === '') return {
            valid: true
        }; // Empty is allowed
        const num = parseFloat(value);
        // Check if it's a valid number
        if (isNaN(num)) {
            return {
                valid: false,
                error: 'Must be a valid number'
            };
        }
        // Check for negative values
        if (num < 0) {
            return {
                valid: false,
                error: 'Deduction cannot be negative'
            };
        }
        // Check decimal places (max 2)
        if (!/^\d+(\.\d{0,2})?$/.test(value)) {
            return {
                valid: false,
                error: 'Maximum 2 decimal places allowed'
            };
        }
        return {
            valid: true
        };
    };
    const validateDeductions = (member, cashDrawn, homeAllowance, otherDeduction)=>{
        const errors = [];
        // Validate individual fields
        const cashError = validateDeductionValue(cashDrawn);
        if (!cashError.valid) errors.push(`Cash Drawn: ${cashError.error}`);
        const homeError = validateDeductionValue(homeAllowance);
        if (!homeError.valid) errors.push(`Home Allotment: ${homeError.error}`);
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
    const calculateFMTODays = (member)=>{
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
        return {
            fm,
            to,
            days
        };
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PortageBill.useEffect": ()=>{
            // Set default current month/year
            const now = new Date();
            setMonth(String(now.getMonth() + 1).padStart(2, '0'));
            setYear(String(now.getFullYear()));
        }
    }["PortageBill.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PortageBill.useEffect": ()=>{
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
        }
    }["PortageBill.useEffect"], [
        selectedVessel,
        month,
        year
    ]);
    const fetchCrewData = async ()=>{
        try {
            setLoading(true);
            if (!selectedVessel) return;
            // Fetch crew with earnings and slopchest deductions for current month
            const crewRes = await fetch(`/api/crew/earnings-with-slopchest?month=${month}&year=${year}`, {
                headers: {
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                }
            });
            if (!crewRes.ok) {
                const errorData = await crewRes.json();
                // Crew API Error - handled in user message
                throw new Error(`Failed to fetch crew: ${errorData.details || errorData.error}`);
            }
            let crewWithEarnings = await crewRes.json();
            // Fetch previous month's earnings to calculate brought forward
            if (parseInt(month) > 1) {
                const prevMonth = String(parseInt(month) - 1).padStart(2, '0');
                const prevYear = year;
                const prevMonthRes = await fetch(`/api/crew/earnings-with-slopchest?month=${prevMonth}&year=${prevYear}`, {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                });
                if (prevMonthRes.ok) {
                    const prevMonthCrew = await prevMonthRes.json();
                    // Create a map of previous month earnings by crew_member_id for quick lookup
                    const prevMonthEarningsMap = new Map();
                    prevMonthCrew.forEach((member)=>{
                        if (member.earnings) {
                            prevMonthEarningsMap.set(member.id, member.earnings);
                        }
                    });
                    // Update current month crew with brought_forward from previous month's final balance
                    crewWithEarnings = crewWithEarnings.map((member)=>{
                        const prevEarnings = prevMonthEarningsMap.get(member.id);
                        if (prevEarnings && member.earnings) {
                            // Calculate previous month's final balance
                            // Final Balance = Total Earnings - Total Deductions + Brought Forward from previous month
                            const prevTotalEarnings = parseFloat(String(prevEarnings.basic_salary || 0)) + parseFloat(String(prevEarnings.fixed_overtime || 0)) + parseFloat(String(prevEarnings.leave_wages || 0)) + parseFloat(String(prevEarnings.other_allowances || 0)) + parseFloat(String(prevEarnings.travel_wages || 0)) + parseFloat(String(prevEarnings.hra || 0)) + parseFloat(String(prevEarnings.joining_expenses || 0)) + parseFloat(String(prevEarnings.onboard_allowance_short_manning || 0));
                            const prevTotalDeductions = parseFloat(String(prevEarnings.cash_drawn || 0)) + parseFloat(String(prevEarnings.home_allowance || 0)) + parseFloat(String(prevEarnings.bond_deduction || 0)) + parseFloat(String(prevEarnings.other_deduction || 0));
                            const prevFinalBalance = Math.round((prevTotalEarnings - prevTotalDeductions + parseFloat(String(prevEarnings.brought_forward || 0))) * 100) / 100;
                            // Set brought_forward for current month to previous month's final balance
                            return {
                                ...member,
                                earnings: {
                                    ...member.earnings,
                                    brought_forward: prevFinalBalance
                                }
                            };
                        }
                        return member;
                    });
                }
            } else if (parseInt(month) === 1 && parseInt(year) > 1) {
                // First month of the year - fetch from previous year
                const prevMonth = '12';
                const prevYear = String(parseInt(year) - 1);
                const prevMonthRes = await fetch(`/api/crew/earnings-with-slopchest?month=${prevMonth}&year=${prevYear}`, {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                });
                if (prevMonthRes.ok) {
                    const prevMonthCrew = await prevMonthRes.json();
                    // Create a map of previous month earnings by crew_member_id for quick lookup
                    const prevMonthEarningsMap = new Map();
                    prevMonthCrew.forEach((member)=>{
                        if (member.earnings) {
                            prevMonthEarningsMap.set(member.id, member.earnings);
                        }
                    });
                    // Update current month crew with brought_forward from previous month's final balance
                    crewWithEarnings = crewWithEarnings.map((member)=>{
                        const prevEarnings = prevMonthEarningsMap.get(member.id);
                        if (prevEarnings && member.earnings) {
                            // Calculate previous month's final balance
                            const prevTotalEarnings = parseFloat(String(prevEarnings.basic_salary || 0)) + parseFloat(String(prevEarnings.fixed_overtime || 0)) + parseFloat(String(prevEarnings.leave_wages || 0)) + parseFloat(String(prevEarnings.other_allowances || 0)) + parseFloat(String(prevEarnings.travel_wages || 0)) + parseFloat(String(prevEarnings.hra || 0)) + parseFloat(String(prevEarnings.joining_expenses || 0)) + parseFloat(String(prevEarnings.onboard_allowance_short_manning || 0));
                            const prevTotalDeductions = parseFloat(String(prevEarnings.cash_drawn || 0)) + parseFloat(String(prevEarnings.home_allowance || 0)) + parseFloat(String(prevEarnings.bond_deduction || 0)) + parseFloat(String(prevEarnings.other_deduction || 0));
                            const prevFinalBalance = Math.round((prevTotalEarnings - prevTotalDeductions + parseFloat(String(prevEarnings.brought_forward || 0))) * 100) / 100;
                            // Set brought_forward for current month to previous month's final balance
                            return {
                                ...member,
                                earnings: {
                                    ...member.earnings,
                                    brought_forward: prevFinalBalance
                                }
                            };
                        }
                        return member;
                    });
                }
            }
            setCrewData(crewWithEarnings);
            // Initialize edit values for all crew members
            const newEditValues = {};
            const newFinalizedRecords = new Set();
            crewWithEarnings.forEach((member)=>{
                const earning = member.earnings;
                const firstMonth = isFirstMonth(member.sign_on_date);
                const earningId = earning?.id || `crew_${member.id}`;
                newEditValues[earningId] = {
                    cash_drawn: String(earning?.cash_drawn || ''),
                    home_allowance: String(earning?.home_allowance || ''),
                    other_deduction: String(earning?.other_deduction || ''),
                    // Travel Wages: now read-only, pre-fetched from earnings table
                    travel_wages: String(earning?.travel_wages || ''),
                    // Joining Expenses: editable only in first month
                    joining_expenses: String(earning?.joining_expenses || (firstMonth ? '' : member.joining_expenses || '')),
                    // HRA: read-only, auto-populated from Travel Wages & HRA screen
                    hra: String(earning?.hra || member.hra || '')
                };
                // Mark records that have earnings data (already saved) as finalized
                if (earning && (earning.cash_drawn !== null || earning.home_allowance !== null || earning.other_deduction !== null)) {
                    newFinalizedRecords.add(earningId);
                }
            });
            setEditValues(newEditValues);
            setFinalizedRecords(newFinalizedRecords);
        } catch (error) {
            alert(`Error loading portage bill: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally{
            setLoading(false);
        }
    };
    const updateFieldValue = (earningId, field, value)=>{
        if (!earningId) return;
        // Prevent editing of travel_wages as it's now read-only
        if (field === 'travel_wages') {
            return;
        }
        // Validate the field value
        const fieldError = validateDeductionValue(value);
        // Update validation errors
        setValidationErrors((prev)=>{
            const errors = prev[earningId] || [];
            const otherErrors = errors.filter((e)=>!e.includes(field.replace(/_/g, ' ')));
            if (!fieldError.valid) {
                return {
                    ...prev,
                    [earningId]: [
                        ...otherErrors,
                        `${field.replace(/_/g, ' ')}: ${fieldError.error}`
                    ]
                };
            } else {
                return {
                    ...prev,
                    [earningId]: otherErrors.length > 0 ? otherErrors : []
                };
            }
        });
        setEditValues((prev)=>({
                ...prev,
                [earningId]: {
                    cash_drawn: prev[earningId]?.cash_drawn ?? '',
                    home_allowance: prev[earningId]?.home_allowance ?? '',
                    other_deduction: prev[earningId]?.other_deduction ?? '',
                    travel_wages: prev[earningId]?.travel_wages ?? '',
                    joining_expenses: prev[earningId]?.joining_expenses ?? '',
                    hra: prev[earningId]?.hra ?? '',
                    onboard_allowance_short_manning: prev[earningId]?.onboard_allowance_short_manning ?? '',
                    [field]: value
                }
            }));
    };
    const saveEarnings = async (earningId)=>{
        if (!earningId || !selectedVessel) return;
        try {
            const values = editValues[earningId];
            if (!values) {
                alert('No values found for editing. Please refresh and try again.');
                return;
            }
            // Find the crew member
            const member = crewData.find((m)=>{
                if (typeof earningId === 'string' && earningId.startsWith('crew_')) {
                    return m.id === parseInt(earningId.replace('crew_', ''));
                }
                return m.earnings?.id === earningId;
            });
            if (!member) {
                alert('Crew member not found');
                return;
            }
            // Check if crew member has exited - prevent entries after exit date
            if (member.sign_off_date) {
                const signOffDate = new Date(member.sign_off_date);
                const monthYear = new Date(parseInt(year), parseInt(month) - 1, 1);
                if (signOffDate < monthYear) {
                    alert(`Cannot add earnings: ${member.name} has already exited on ${signOffDate.toDateString()}.\n\nNo deductions or earnings can be added after the exit date.`);
                    return;
                }
            }
            // Validate deductions
            const validation = validateDeductions(member, values.cash_drawn || '', values.home_allowance || '', values.other_deduction || '');
            if (!validation.valid) {
                alert('Validation Errors:\n\n' + validation.errors.join('\n'));
                return;
            }
            // Additional check: ensure total deductions don't exceed total earnings
            const totalEarnings = (member.basic_salary || 0) + (member.fixed_overtime || 0) + (member.leave_wages || 0) + (member.other_allowances || 0) + (member.earnings?.travel_wages || 0) + (values?.hra ? parseFloat(values.hra) : member.earnings?.hra || 0) + (values?.joining_expenses ? parseFloat(values.joining_expenses) : member.earnings?.joining_expenses || 0) + (values?.onboard_allowance_short_manning ? parseFloat(values.onboard_allowance_short_manning) : member.earnings?.onboard_allowance_short_manning || 0);
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
            const hasChanges = values.cash_drawn !== String(member.earnings?.cash_drawn || '') || values.home_allowance !== String(member.earnings?.home_allowance || '') || values.other_deduction !== String(member.earnings?.other_deduction || '') || values.onboard_allowance_short_manning !== String(member.earnings?.onboard_allowance_short_manning || '') || // travel_wages no longer checked as it's read-only
            values.joining_expenses !== String(member.earnings?.joining_expenses || '');
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
                    onboard_allowance_short_manning: values.onboard_allowance_short_manning ? parseFloat(values.onboard_allowance_short_manning) : 0
                };
                response = await fetch(`/api/crew/earnings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    },
                    body: JSON.stringify(createPayload)
                });
            } else {
                // Update existing earnings record
                const updatePayload = {
                    cash_drawn: parseFloat(values.cash_drawn) || 0,
                    home_allowance: parseFloat(values.home_allowance) || 0,
                    other_deduction: parseFloat(values.other_deduction) || 0,
                    onboard_allowance_short_manning: values.onboard_allowance_short_manning ? parseFloat(values.onboard_allowance_short_manning) : undefined,
                    // travel_wages is now read-only, pre-fetched from earnings table
                    joining_expenses: values.joining_expenses ? parseFloat(values.joining_expenses) : undefined
                };
                response = await fetch(`/api/crew/earnings/${earningId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    },
                    body: JSON.stringify(updatePayload)
                });
            }
            if (!response.ok) {
                let errorMessage = 'Failed to update earnings';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.details || errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            const responseData = await response.json();
            alert('Earnings updated successfully. This record is now finalized and cannot be edited again.');
            setEditingId(null);
            // Mark record as finalized to prevent re-editing
            setFinalizedRecords((prev)=>new Set([
                    ...prev,
                    earningId
                ]));
            // Refresh data to get updated earnings
            fetchCrewData();
        } catch (error) {
            alert(`Error saving earnings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    const cancelEarnings = (earningId)=>{
        setEditingId(null);
    };
    const getMonthName = ()=>{
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        return months[parseInt(month) - 1] || '';
    };
    const getRankCategory = (rank)=>{
        if (!rank) return 'OTHERS';
        const officerRanks = [
            'Master',
            'Chief Officer',
            'Chief Engineer',
            '2nd Officer',
            '3rd Officer',
            '2nd Engineer',
            '3rd Engineer',
            'Admin',
            'Captain',
            'CAPT',
            'CHOE',
            'SECOFF',
            'CMO'
        ];
        return officerRanks.some((r)=>rank.toLowerCase().includes(r.toLowerCase())) ? 'OFFICERS' : 'RATINGS';
    };
    const getCrewStatus = (member)=>{
        // Check if crew member has joined yet
        if (member.sign_on_date) {
            const signOnDate = new Date(member.sign_on_date);
            const signOnMonth = signOnDate.getMonth() + 1;
            const signOnYear = signOnDate.getFullYear();
            // If sign-on date is after current month being viewed, crew hasn't joined yet
            if (signOnYear > parseInt(year) || signOnYear === parseInt(year) && signOnMonth > parseInt(month)) {
                return 'NOT_JOINED';
            }
        }
        if (!member.sign_off_date) return 'ACTIVE';
        const signOffDate = new Date(member.sign_off_date);
        const signOffMonth = signOffDate.getMonth() + 1;
        const signOffYear = signOffDate.getFullYear();
        // Session C - Off Signers: Show ONLY if signed off in the EXACT month being viewed
        // This ensures they appear only once in that month's Portage Bill, never in subsequent months
        if (signOffMonth === parseInt(month) && signOffYear === parseInt(year)) {
            return 'RELIEVED';
        }
        // If signed off before current month, they are NOT shown (they are not active anymore)
        // They will not appear in any session
        if (signOffYear < parseInt(year) || signOffYear === parseInt(year) && signOffMonth < parseInt(month)) {
            return 'RELIEVED'; // This will exclude them from all sessions as they should not be displayed
        }
        return 'ACTIVE';
    };
    // Filter: Only show ACTIVE crew members (those who haven't signed off)
    // or those who signed off in the current month (Session C - Off-Signers)
    // Exclude crew members who haven't joined yet
    const crewDataFiltered = crewData.filter((member)=>{
        const status = getCrewStatus(member);
        // Exclude crew who haven't joined yet
        if (status === 'NOT_JOINED') return false;
        // Include only active members OR those relieved in this specific month
        if (status === 'ACTIVE') return true;
        if (status === 'RELIEVED' && member.sign_off_date) {
            const signOffDate = new Date(member.sign_off_date);
            const signOffMonth = signOffDate.getMonth() + 1;
            const signOffYear = signOffDate.getFullYear();
            return signOffMonth === parseInt(month) && signOffYear === parseInt(year);
        }
        return false;
    });
    const groupedCrew = crewDataFiltered.reduce((acc, member)=>{
        const status = getCrewStatus(member);
        const rankCategory = getRankCategory(member.rank);
        if (status === 'RELIEVED') {
            // Session C: Off Signers During the Month
            if (!acc['OFF_SIGNERS']) acc['OFF_SIGNERS'] = [];
            acc['OFF_SIGNERS'].push(member);
        } else if (rankCategory === 'OFFICERS') {
            // Session A: Top Rank Crew Members
            if (!acc['TOP_RANK']) acc['TOP_RANK'] = [];
            acc['TOP_RANK'].push(member);
        } else {
            // Session B: Below Rank Crew Members
            if (!acc['BELOW_RANK']) acc['BELOW_RANK'] = [];
            acc['BELOW_RANK'].push(member);
        }
        return acc;
    }, {});
    const calculateTotalDeductions = (member, customValues)=>{
        const values = customValues || editValues[member.earnings?.id || `crew_${member.id}`];
        const cash = values?.cash_drawn || member.earnings?.cash_drawn || 0;
        const home = values?.home_allowance || member.earnings?.home_allowance || 0;
        const bond = member.earnings?.bond_deduction || 0;
        const other = values?.other_deduction || member.earnings?.other_deduction || 0;
        return parseFloat(String(cash)) + parseFloat(String(home)) + parseFloat(String(bond)) + parseFloat(String(other));
    };
    const calculateTotalEarnings = (member, customValues)=>{
        const values = customValues || editValues[member.earnings?.id || `crew_${member.id}`];
        // Total Earnings = Basic + Fixed OT + Leave Wages + Other Allowance + Travel wages + HRA + Joining Exp + Onboard allowance
        const basic = parseFloat(String(member.basic_salary || 0));
        const fixedOT = parseFloat(String(member.fixed_overtime || 0));
        const leaveWages = parseFloat(String(member.leave_wages || 0));
        const otherAllowance = parseFloat(String(member.other_allowances || 0));
        // Travel Wages: always read-only from earnings table
        const travelWages = parseFloat(String(member.earnings?.travel_wages || 0));
        const hra = parseFloat(String(values?.hra || member.earnings?.hra || 0));
        const joiningExp = parseFloat(String(values?.joining_expenses || member.earnings?.joining_expenses || 0));
        const onboardAllowance = parseFloat(String(values?.onboard_allowance_short_manning || member.earnings?.onboard_allowance_short_manning || 0));
        return basic + fixedOT + leaveWages + otherAllowance + travelWages + hra + joiningExp + onboardAllowance;
    };
    const calculateFinalBalance = (member, customValues)=>{
        const totalEarnings = calculateTotalEarnings(member, customValues);
        const totalDeductions = calculateTotalDeductions(member, customValues);
        const broughtForward = parseFloat(String(member.earnings?.brought_forward || 0));
        return totalEarnings - totalDeductions + broughtForward;
    };
    const getExitStatusIcon = (exitType)=>{
        if (!exitType) return '✓';
        const normalExits = [
            'NORMAL',
            'COMPLETION',
            'RELIEVED',
            'END_OF_CONTRACT',
            'NORMAL_RELIEF',
            'SUCCESS'
        ];
        return normalExits.some((type)=>String(exitType).toUpperCase().includes(type)) ? '✓' : '✗';
    };
    const getExitStatusColor = (exitType)=>{
        const icon = getExitStatusIcon(exitType);
        return icon === '✓' ? 'text-green-600' : 'text-red-600';
    };
    const renderCrew = (category, members, startingNumber)=>{
        return members.map((member, index)=>{
            const earningId = member.earnings?.id || `crew_${member.id}`;
            const isFinalized = finalizedRecords.has(earningId);
            const values = editValues[earningId] || {
                cash_drawn: '',
                home_allowance: '',
                other_deduction: '',
                travel_wages: '',
                joining_expenses: '',
                hra: '',
                onboard_allowance_short_manning: ''
            };
            const isEditing = editingId === earningId;
            const fmToDays = calculateFMTODays(member);
            const firstMonth = isFirstMonth(member.sign_on_date);
            // Get display values - prioritize earnings record, then crew_member for non-calculated fields
            const getDisplayValue = (earningValue, memberValue, defaultValue = '0')=>{
                if (earningValue !== null && earningValue !== undefined && earningValue !== '') {
                    return String(earningValue);
                }
                return String(memberValue || defaultValue);
            };
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "border-b border-gray-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs font-medium",
                        children: startingNumber + index
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 773,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs flex items-center gap-2",
                        children: [
                            member.name,
                            category === 'OFF_SIGNERS' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-lg font-bold ${getExitStatusColor(member.exit_type)} cursor-help`,
                                title: `Exit Type: ${member.exit_type || 'N/A'}\nRemarks: ${member.exit_remarks || 'No remarks'}`,
                                children: getExitStatusIcon(member.exit_type)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                lineNumber: 777,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 774,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs",
                        children: member.rank || '-'
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 782,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-center",
                        children: fmToDays.fm
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 783,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-center",
                        children: fmToDays.to
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 784,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-center",
                        children: fmToDays.days
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 785,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right font-medium",
                        children: parseFloat(String(member.basic_salary || 0)).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 787,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right",
                        children: parseFloat(String(member.fixed_overtime || 0)).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 789,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right",
                        children: parseFloat(String(member.leave_wages || 0)).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 791,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right",
                        children: parseFloat(String(member.other_allowances || 0)).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 793,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right bg-gray-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-1 py-1 cursor-help",
                            title: "Travel Wages is pre-fetched from the Travel Wages & HRA screen and is read-only.",
                            children: parseFloat(String(member.earnings?.travel_wages || 0)).toFixed(2)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 797,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 796,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right bg-gray-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-1 py-1 cursor-help",
                            title: "HRA is auto-populated from Travel Wages & HRA screen. To edit HRA, use the Travel Wages & HRA screen.",
                            children: parseFloat(String(member.earnings?.hra || member.hra || 0)).toFixed(2)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 804,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 803,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right",
                        style: {
                            backgroundColor: firstMonth ? '#E0F2FE' : 'white'
                        },
                        children: firstMonth ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            step: "0.01",
                            value: values.joining_expenses,
                            onChange: (e)=>updateFieldValue(earningId, 'joining_expenses', e.target.value),
                            onFocus: ()=>!isFinalized && setEditingId(earningId),
                            disabled: isFinalized,
                            className: "w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 812,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-1 py-1",
                            children: parseFloat(getDisplayValue(member.earnings?.joining_expenses, member.joining_expenses)).toFixed(2)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 822,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 810,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right bg-blue-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            step: "0.01",
                            value: values.onboard_allowance_short_manning,
                            onChange: (e)=>updateFieldValue(earningId, 'onboard_allowance_short_manning', e.target.value),
                            onFocus: ()=>!isFinalized && setEditingId(earningId),
                            disabled: isFinalized,
                            className: "w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 827,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 826,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right font-semibold bg-gray-200",
                        children: calculateTotalEarnings(member).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 837,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right bg-blue-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            step: "0.01",
                            value: values.cash_drawn,
                            onChange: (e)=>updateFieldValue(earningId, 'cash_drawn', e.target.value),
                            onFocus: ()=>!isFinalized && setEditingId(earningId),
                            disabled: isFinalized,
                            className: "w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 841,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 840,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right bg-blue-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            step: "0.01",
                            value: values.home_allowance,
                            onChange: (e)=>updateFieldValue(earningId, 'home_allowance', e.target.value),
                            onFocus: ()=>!isFinalized && setEditingId(earningId),
                            disabled: isFinalized,
                            className: "w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 852,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 851,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right bg-blue-50 cursor-help hover:bg-blue-100",
                        title: `Slopchest Deduction: $${parseFloat(String(member.slopchest_deduction || 0)).toFixed(2)}`,
                        children: parseFloat(String(member.earnings?.bond_deduction || 0)).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 862,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right bg-blue-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            step: "0.01",
                            value: values.other_deduction,
                            onChange: (e)=>updateFieldValue(earningId, 'other_deduction', e.target.value),
                            onFocus: ()=>!isFinalized && setEditingId(earningId),
                            disabled: isFinalized,
                            className: "w-full px-1 py-1 border-0 bg-transparent text-right focus:bg-white focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 869,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 868,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right font-semibold bg-blue-50",
                        children: calculateTotalDeductions(member).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 879,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right",
                        children: parseFloat(String(member.earnings?.brought_forward || 0)).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 882,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "border-r border-gray-300 px-2 py-1 text-xs text-right font-bold bg-gray-300",
                        children: parseFloat(calculateFinalBalance(member).toFixed(2)).toFixed(2)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 883,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-2 py-1 text-xs text-center",
                        children: isFinalized ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-500 text-xs font-semibold bg-gray-100 px-2 py-1 rounded inline-block",
                            children: "Finalized"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 890,
                            columnNumber: 29
                        }, this) : isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-1 justify-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>saveEarnings(earningId),
                                            className: "px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700",
                                            children: "Save"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 894,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                cancelEarnings(earningId);
                                                setValidationErrors((prev)=>{
                                                    const newErrors = {
                                                        ...prev
                                                    };
                                                    delete newErrors[earningId || ''];
                                                    return newErrors;
                                                });
                                            },
                                            className: "px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 900,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                    lineNumber: 893,
                                    columnNumber: 33
                                }, this),
                                validationErrors[earningId] && validationErrors[earningId].length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-red-600 bg-red-50 p-1 rounded border border-red-200",
                                    children: validationErrors[earningId].map((err, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: err
                                        }, idx, false, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 917,
                                            columnNumber: 45
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                    lineNumber: 915,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 892,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400 text-xs",
                            children: "Ready"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 923,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 888,
                        columnNumber: 21
                    }, this)
                ]
            }, member.id, true, {
                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                lineNumber: 772,
                columnNumber: 17
            }, this);
        });
    };
    const exportToExcel = ()=>{
        if (!selectedVessel || crewData.length === 0 || !month || !year) {
            alert('No data to export. Please select a month and year, and ensure crew data is loaded.');
            return;
        }
        try {
            const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
            const sheetData = [];
            // Header
            sheetData.push([
                `${selectedVessel.vessel_name} - PORTAGE BILL - ${getMonthName()} ${year}`
            ]);
            sheetData.push([]);
            // Session A
            sheetData.push([
                'SESSION A - TOP RANK CREW MEMBERS'
            ]);
            sheetData.push([
                'SR NO',
                'NAME',
                'RANK',
                'FM',
                'TO',
                'DAYS',
                'BASIC',
                'FIXED OT',
                'LEAVE WAGES',
                'OTHER ALLOWANCES',
                'TRAVEL WAGES',
                'HRA',
                'JOINING EXP',
                'ONBOARD',
                'TOTAL EARNINGS',
                'CASH DRAWN',
                'HOME ALLOT',
                'BOND',
                'OTHER DEDUCT',
                'TOTAL DEDUCT',
                'B/F',
                'FINAL BAL'
            ]);
            topRankMembers.forEach((m, i)=>{
                const { fm, to, days } = calculateFMTODays(m);
                sheetData.push([
                    i + 1,
                    m.name,
                    m.rank,
                    fm,
                    to,
                    days,
                    m.basic_salary,
                    m.fixed_overtime,
                    m.leave_wages,
                    m.other_allowances,
                    m.earnings?.travel_wages || 0,
                    m.earnings?.hra || 0,
                    m.earnings?.joining_expenses || 0,
                    m.earnings?.onboard_allowance_short_manning || 0,
                    calculateTotalEarnings(m),
                    m.earnings?.cash_drawn || 0,
                    m.earnings?.home_allowance || 0,
                    m.earnings?.bond_deduction || 0,
                    m.earnings?.other_deduction || 0,
                    calculateTotalDeductions(m),
                    m.earnings?.brought_forward || 0,
                    calculateFinalBalance(m)
                ]);
            });
            sheetData.push([
                'SESSION A TOTAL',
                '',
                '',
                '',
                '',
                '',
                topRankTotals.basic,
                topRankTotals.fixedOT,
                topRankTotals.leaveWages,
                topRankTotals.otherAllowances,
                topRankTotals.travelWages,
                topRankTotals.hra,
                topRankTotals.joiningExp,
                topRankTotals.onboardAllowance,
                topRankTotals.totalEarnings,
                topRankTotals.cashDrawn,
                topRankTotals.homeAllowance,
                topRankTotals.bondDeduction,
                topRankTotals.otherDeduction,
                topRankTotals.totalDeductions,
                topRankTotals.broughtForward,
                topRankTotals.finalBalance
            ]);
            sheetData.push([]);
            // Session B
            sheetData.push([
                'SESSION B - BELOW RANK CREW MEMBERS'
            ]);
            sheetData.push([
                'SR NO',
                'NAME',
                'RANK',
                'FM',
                'TO',
                'DAYS',
                'BASIC',
                'FIXED OT',
                'LEAVE WAGES',
                'OTHER ALLOWANCES',
                'TRAVEL WAGES',
                'HRA',
                'JOINING EXP',
                'ONBOARD',
                'TOTAL EARNINGS',
                'CASH DRAWN',
                'HOME ALLOT',
                'BOND',
                'OTHER DEDUCT',
                'TOTAL DEDUCT',
                'B/F',
                'FINAL BAL'
            ]);
            belowRankMembers.forEach((m, i)=>{
                const { fm, to, days } = calculateFMTODays(m);
                sheetData.push([
                    i + 1,
                    m.name,
                    m.rank,
                    fm,
                    to,
                    days,
                    m.basic_salary,
                    m.fixed_overtime,
                    m.leave_wages,
                    m.other_allowances,
                    m.earnings?.travel_wages || 0,
                    m.earnings?.hra || 0,
                    m.earnings?.joining_expenses || 0,
                    m.earnings?.onboard_allowance_short_manning || 0,
                    calculateTotalEarnings(m),
                    m.earnings?.cash_drawn || 0,
                    m.earnings?.home_allowance || 0,
                    m.earnings?.bond_deduction || 0,
                    m.earnings?.other_deduction || 0,
                    calculateTotalDeductions(m),
                    m.earnings?.brought_forward || 0,
                    calculateFinalBalance(m)
                ]);
            });
            sheetData.push([
                'SESSION B TOTAL',
                '',
                '',
                '',
                '',
                '',
                belowRankTotals.basic,
                belowRankTotals.fixedOT,
                belowRankTotals.leaveWages,
                belowRankTotals.otherAllowances,
                belowRankTotals.travelWages,
                belowRankTotals.hra,
                belowRankTotals.joiningExp,
                belowRankTotals.onboardAllowance,
                belowRankTotals.totalEarnings,
                belowRankTotals.cashDrawn,
                belowRankTotals.homeAllowance,
                belowRankTotals.bondDeduction,
                belowRankTotals.otherDeduction,
                belowRankTotals.totalDeductions,
                belowRankTotals.broughtForward,
                belowRankTotals.finalBalance
            ]);
            sheetData.push([]);
            // Session C
            sheetData.push([
                'SESSION C - OFF SIGNERS DURING THE MONTH'
            ]);
            sheetData.push([
                'SR NO',
                'NAME',
                'RANK',
                'FM',
                'TO',
                'DAYS',
                'BASIC',
                'FIXED OT',
                'LEAVE WAGES',
                'OTHER ALLOWANCES',
                'TRAVEL WAGES',
                'HRA',
                'JOINING EXP',
                'ONBOARD',
                'TOTAL EARNINGS',
                'CASH DRAWN',
                'HOME ALLOT',
                'BOND',
                'OTHER DEDUCT',
                'TOTAL DEDUCT',
                'B/F',
                'FINAL BAL'
            ]);
            offSignersMembers.forEach((m, i)=>{
                const { fm, to, days } = calculateFMTODays(m);
                sheetData.push([
                    i + 1,
                    m.name,
                    m.rank,
                    fm,
                    to,
                    days,
                    m.basic_salary,
                    m.fixed_overtime,
                    m.leave_wages,
                    m.other_allowances,
                    m.earnings?.travel_wages || 0,
                    m.earnings?.hra || 0,
                    m.earnings?.joining_expenses || 0,
                    m.earnings?.onboard_allowance_short_manning || 0,
                    calculateTotalEarnings(m),
                    m.earnings?.cash_drawn || 0,
                    m.earnings?.home_allowance || 0,
                    m.earnings?.bond_deduction || 0,
                    m.earnings?.other_deduction || 0,
                    calculateTotalDeductions(m),
                    m.earnings?.brought_forward || 0,
                    calculateFinalBalance(m)
                ]);
            });
            sheetData.push([
                'SESSION C TOTAL',
                '',
                '',
                '',
                '',
                '',
                offSignersTotals.basic,
                offSignersTotals.fixedOT,
                offSignersTotals.leaveWages,
                offSignersTotals.otherAllowances,
                offSignersTotals.travelWages,
                offSignersTotals.hra,
                offSignersTotals.joiningExp,
                offSignersTotals.onboardAllowance,
                offSignersTotals.totalEarnings,
                offSignersTotals.cashDrawn,
                offSignersTotals.homeAllowance,
                offSignersTotals.bondDeduction,
                offSignersTotals.otherDeduction,
                offSignersTotals.totalDeductions,
                offSignersTotals.broughtForward,
                offSignersTotals.finalBalance
            ]);
            const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].aoa_to_sheet(sheetData);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'Portage Bill');
            const fileName = `${selectedVessel.vessel_name}_PortageBill_${getMonthName()}_${year}.xlsx`;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, fileName);
        } catch (error) {
            alert('Error exporting to Excel: ' + (error instanceof Error ? error.message : 'Unknown error'));
            console.error(error);
        }
    };
    const calculateCategoryTotals = (members)=>{
        return {
            basic: members.reduce((sum, m)=>sum + parseFloat(String(m.basic_salary || 0)), 0),
            fixedOT: members.reduce((sum, m)=>sum + parseFloat(String(m.fixed_overtime || 0)), 0),
            leaveWages: members.reduce((sum, m)=>sum + parseFloat(String(m.leave_wages || 0)), 0),
            otherAllowances: members.reduce((sum, m)=>sum + parseFloat(String(m.other_allowances || 0)), 0),
            travelWages: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.travel_wages || 0)), 0),
            hra: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.hra || 0)), 0),
            joiningExp: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.joining_expenses || 0)), 0),
            onboardAllowance: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.onboard_allowance_short_manning || 0)), 0),
            totalEarnings: members.reduce((sum, m)=>sum + calculateTotalEarnings(m), 0),
            cashDrawn: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.cash_drawn || 0)), 0),
            homeAllowance: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.home_allowance || 0)), 0),
            bondDeduction: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.bond_deduction || 0)), 0),
            otherDeduction: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.other_deduction || 0)), 0),
            totalDeductions: members.reduce((sum, m)=>sum + parseFloat(String(calculateTotalDeductions(m))), 0),
            broughtForward: members.reduce((sum, m)=>sum + parseFloat(String(m.earnings?.brought_forward || 0)), 0),
            finalBalance: members.reduce((sum, m)=>sum + parseFloat(String(calculateFinalBalance(m))), 0)
        };
    };
    const topRankTotals = calculateCategoryTotals(groupedCrew['TOP_RANK'] || []);
    const belowRankTotals = calculateCategoryTotals(groupedCrew['BELOW_RANK'] || []);
    const offSignersTotals = calculateCategoryTotals(groupedCrew['OFF_SIGNERS'] || []);
    const topRankMembers = groupedCrew['TOP_RANK'] || [];
    const belowRankMembers = groupedCrew['BELOW_RANK'] || [];
    const offSignersMembers = groupedCrew['OFF_SIGNERS'] || [];
    // For backwards compatibility in other calculations
    const activeMembers = [
        ...topRankMembers,
        ...belowRankMembers
    ];
    const relievedMembers = offSignersMembers;
    const activeTotals = {
        basic: topRankTotals.basic + belowRankTotals.basic,
        fixedOT: topRankTotals.fixedOT + belowRankTotals.fixedOT,
        leaveWages: topRankTotals.leaveWages + belowRankTotals.leaveWages,
        otherAllowances: topRankTotals.otherAllowances + belowRankTotals.otherAllowances,
        travelWages: topRankTotals.travelWages + belowRankTotals.travelWages,
        hra: topRankTotals.hra + belowRankTotals.hra,
        joiningExp: topRankTotals.joiningExp + belowRankTotals.joiningExp,
        onboardAllowance: topRankTotals.onboardAllowance + belowRankTotals.onboardAllowance,
        totalEarnings: topRankTotals.totalEarnings + belowRankTotals.totalEarnings,
        cashDrawn: topRankTotals.cashDrawn + belowRankTotals.cashDrawn,
        homeAllowance: topRankTotals.homeAllowance + belowRankTotals.homeAllowance,
        bondDeduction: topRankTotals.bondDeduction + belowRankTotals.bondDeduction,
        otherDeduction: topRankTotals.otherDeduction + belowRankTotals.otherDeduction,
        totalDeductions: topRankTotals.totalDeductions + belowRankTotals.totalDeductions,
        broughtForward: topRankTotals.broughtForward + belowRankTotals.broughtForward,
        finalBalance: topRankTotals.finalBalance + belowRankTotals.finalBalance
    };
    const relievedTotals = offSignersTotals;
    if (!selectedVessel) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6 p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-yellow-800",
                    children: "Please select a vessel from the dashboard header to view the Portage Bill."
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                    lineNumber: 1040,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                lineNumber: 1039,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
            lineNumber: 1038,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-sm border border-gray-200 p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold text-gray-900 mb-2",
                        children: "Portage Bill Report"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 1050,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-end gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-gray-700 mb-1",
                                        children: "Month"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                        lineNumber: 1054,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: month,
                                        onChange: (e)=>setMonth(e.target.value),
                                        className: "px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Select"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1060,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "01",
                                                children: "January"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1061,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "02",
                                                children: "February"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1062,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "03",
                                                children: "March"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1063,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "04",
                                                children: "April"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1064,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "05",
                                                children: "May"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1065,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "06",
                                                children: "June"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1066,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "07",
                                                children: "July"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1067,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "08",
                                                children: "August"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1068,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "09",
                                                children: "September"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1069,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "10",
                                                children: "October"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1070,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "11",
                                                children: "November"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1071,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "12",
                                                children: "December"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1072,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                        lineNumber: 1055,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                lineNumber: 1053,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-gray-700 mb-1",
                                        children: "Year"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                        lineNumber: 1076,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: year,
                                        onChange: (e)=>setYear(e.target.value),
                                        className: "px-2 py-1 border border-gray-300 rounded text-xs w-20 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                        lineNumber: 1077,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                lineNumber: 1075,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: exportToExcel,
                                className: "px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium whitespace-nowrap",
                                children: "📊 Export"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                lineNumber: 1084,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                        lineNumber: 1052,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                lineNumber: 1049,
                columnNumber: 13
            }, this),
            !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full border-collapse text-xs",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 24,
                                        className: "text-center font-bold text-base py-3 bg-blue-600 text-white border border-gray-400 break-words whitespace-normal",
                                        children: [
                                            selectedVessel.vessel_name,
                                            " - PORTAGE BILL - MONTH OF ",
                                            getMonthName(),
                                            "-",
                                            year.slice(-2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                        lineNumber: 1101,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                    lineNumber: 1100,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                lineNumber: 1099,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 1097,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full border-collapse text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-gray-500 text-white border border-gray-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    colSpan: 6,
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1113,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    colSpan: 9,
                                                    className: "text-center border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "E A R N I N G S"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1114,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    colSpan: 7,
                                                    className: "text-center border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "D E D U C T I O N S"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1115,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-2 py-2 font-bold"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1116,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 1112,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-gray-600 text-white border border-gray-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "SR. NO."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1120,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "NAME"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1121,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "RANK"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1122,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "FM"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1123,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "TO"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1124,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold",
                                                    children: "DAYS"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1125,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "BASIC"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1126,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "FIXED OT"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1127,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "LEAVE WAGES"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1128,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "OTHER ALLOWANCES"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1129,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "Travel Wages"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1130,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "HRA"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1131,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "JOINING EXPENSES"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1132,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    title: "ONBOARD ALLOWANCE / SHORT MANNING",
                                                    children: "ONBOARD ALLOW."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1133,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "TOTAL EARNINGS"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1134,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "CASH DRAWN ON"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1135,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "HOME ALLOW."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1136,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "BOND"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1137,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "OTHER DEDUCTION"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1138,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "TOTAL DEDUCTION"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1139,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "BROUGHT FORWARD"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1140,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "border-r border-gray-300 px-2 py-2 font-bold whitespace-nowrap",
                                                    children: "FINAL BALANCE"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1141,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 1119,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                    lineNumber: 1110,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: [
                                        renderCrew('TOP_RANK', topRankMembers, 1),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-gray-300 font-bold border border-gray-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 6,
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: "SESSION A - TOTAL"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1151,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.basic.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1152,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.fixedOT.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1153,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.leaveWages.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1154,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.otherAllowances.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1155,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.travelWages.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1156,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.hra.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1157,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.joiningExp.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1158,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.onboardAllowance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1159,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.totalEarnings.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1160,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.cashDrawn.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1161,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.homeAllowance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1162,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.bondDeduction.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1163,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.otherDeduction.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1164,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.totalDeductions.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1165,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.broughtForward.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1166,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: topRankTotals.finalBalance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1167,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1168,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 1150,
                                            columnNumber: 33
                                        }, this),
                                        renderCrew('BELOW_RANK', belowRankMembers, topRankMembers.length + 1),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-gray-300 font-bold border border-gray-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 6,
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: "SESSION B - TOTAL"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1176,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.basic.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1177,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.fixedOT.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1178,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.leaveWages.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1179,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.otherAllowances.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1180,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.travelWages.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1181,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.hra.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1182,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.joiningExp.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1183,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.onboardAllowance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1184,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.totalEarnings.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1185,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.cashDrawn.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1186,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.homeAllowance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1187,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.bondDeduction.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1188,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.otherDeduction.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1189,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.totalDeductions.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1190,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.broughtForward.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1191,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: belowRankTotals.finalBalance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1192,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1193,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 1175,
                                            columnNumber: 33
                                        }, this),
                                        offSignersMembers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-yellow-200 font-bold border border-gray-300",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 24,
                                                className: "border border-gray-300 px-2 py-3 text-left",
                                                children: "SESSION C - OFF SIGNERS DURING THE MONTH"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                lineNumber: 1199,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 1198,
                                            columnNumber: 37
                                        }, this),
                                        renderCrew('OFF_SIGNERS', offSignersMembers, topRankMembers.length + belowRankMembers.length + 1),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-gray-300 font-bold border border-gray-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 6,
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: "SESSION C - TOTAL"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1208,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.basic.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1209,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.fixedOT.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1210,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.leaveWages.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1211,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.otherAllowances.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1212,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.travelWages.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1213,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.hra.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1214,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.joiningExp.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.onboardAllowance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1216,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.totalEarnings.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1217,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.cashDrawn.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1218,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.homeAllowance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1219,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.bondDeduction.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1220,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.otherDeduction.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1221,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.totalDeductions.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1222,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.broughtForward.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1223,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: offSignersTotals.finalBalance.toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1224,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1225,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 1207,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "bg-gray-400 text-white font-bold border border-gray-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 6,
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: "GRAND TOTAL (A+B+C)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1230,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.basic + belowRankTotals.basic + offSignersTotals.basic).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.fixedOT + belowRankTotals.fixedOT + offSignersTotals.fixedOT).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1232,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.leaveWages + belowRankTotals.leaveWages + offSignersTotals.leaveWages).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1233,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.otherAllowances + belowRankTotals.otherAllowances + offSignersTotals.otherAllowances).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1234,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.travelWages + belowRankTotals.travelWages + offSignersTotals.travelWages).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1235,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.hra + belowRankTotals.hra + offSignersTotals.hra).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1236,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.joiningExp + belowRankTotals.joiningExp + offSignersTotals.joiningExp).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1237,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.onboardAllowance + belowRankTotals.onboardAllowance + offSignersTotals.onboardAllowance).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1238,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.totalEarnings + belowRankTotals.totalEarnings + offSignersTotals.totalEarnings).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1239,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.cashDrawn + belowRankTotals.cashDrawn + offSignersTotals.cashDrawn).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1240,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.homeAllowance + belowRankTotals.homeAllowance + offSignersTotals.homeAllowance).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1241,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.bondDeduction + belowRankTotals.bondDeduction + offSignersTotals.bondDeduction).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1242,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.otherDeduction + belowRankTotals.otherDeduction + offSignersTotals.otherDeduction).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1243,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.totalDeductions + belowRankTotals.totalDeductions + offSignersTotals.totalDeductions).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1244,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.broughtForward + belowRankTotals.broughtForward + offSignersTotals.broughtForward).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1245,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-gray-300 px-2 py-2 text-right",
                                                    children: (topRankTotals.finalBalance + belowRankTotals.finalBalance + offSignersTotals.finalBalance).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1246,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                                    lineNumber: 1247,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                            lineNumber: 1229,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                                    lineNumber: 1146,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                            lineNumber: 1109,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                    lineNumber: 1096,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                lineNumber: 1095,
                columnNumber: 17
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-12 text-gray-500",
                children: "Loading crew data..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
                lineNumber: 1258,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/reports/portage-bill/page.tsx",
        lineNumber: 1047,
        columnNumber: 9
    }, this);
}
_s(PortageBill, "os5uETbWbQVsycDf0KD/S2vZKM0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$VesselContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVessel"]
    ];
});
_c = PortageBill;
var _c;
__turbopack_context__.k.register(_c, "PortageBill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_dashboard_reports_portage-bill_page_tsx_6f49bb48._.js.map