module.exports = [
"[project]/app/dashboard/travel-wages-hra/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TravelWagesHRA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$VesselContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/context/VesselContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function TravelWagesHRA() {
    const { selectedVessel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$VesselContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVessel"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('travel-wages');
    const [travelMonth, setTravelMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [crew, setCrew] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [travelWagesData, setTravelWagesData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [savingTravel, setSavingTravel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hraStartDate, setHraStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [hraEndDate, setHraEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [hraData, setHraData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [savingHRA, setSavingHRA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savedHRARecords, setSavedHRARecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingSavedHRA, setLoadingSavedHRA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savedTravelWagesRecords, setSavedTravelWagesRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingSavedTravel, setLoadingSavedTravel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Fetch crew members when dates change (Travel Wages) or vessel changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!selectedVessel) return;
        if (activeTab === 'travel-wages') {
            fetchActiveCrew();
            fetchSavedTravelWagesRecords();
        } else if (activeTab === 'hra') {
            // Always fetch fresh HRA crew (all active members) when switching to HRA tab
            fetchHRACrew();
        }
    }, [
        travelMonth,
        selectedVessel,
        activeTab
    ]);
    // Initialize HRA data when crew changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (activeTab === 'hra' && crew.length > 0) {
            // Calculate days from current HRA dates
            const totalDays = calculateDaysBetween(hraStartDate, hraEndDate);
            const hraStartDateObj = new Date(hraStartDate);
            const hraEndDateObj = new Date(hraEndDate);
            const updated = {};
            crew.forEach((member)=>{
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
    }, [
        activeTab,
        crew,
        hraStartDate,
        hraEndDate
    ]);
    // Fetch saved HRA records for current month when HRA tab is active
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (activeTab === 'hra' && selectedVessel) {
            fetchSavedHRARecords();
        }
    }, [
        activeTab,
        selectedVessel,
        hraStartDate
    ]);
    const fetchActiveCrew = async ()=>{
        if (!selectedVessel) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/crew?vesselId=${selectedVessel.vessel_id}`, {
                headers: {
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                }
            });
            if (!response.ok) throw new Error('Failed to fetch crew');
            const allCrew = await response.json();
            // Get month and year from travelMonth
            const selectedDateObj = new Date(travelMonth);
            const selectedMonth = selectedDateObj.getMonth();
            const selectedYear = selectedDateObj.getFullYear();
            // Filter for crew newly onboarded in the selected month and not yet offboarded
            const travelWagesCrew = allCrew.filter((member)=>{
                const signOnDate = member.sign_on_date ? new Date(member.sign_on_date) : null;
                const signOffDate = member.sign_off_date ? new Date(member.sign_off_date) : null;
                // Check if signed on in the selected month
                const isOnboardedInMonth = signOnDate && signOnDate.getMonth() === selectedMonth && signOnDate.getFullYear() === selectedYear;
                // Check if not yet offboarded (or offboard date is in the future)
                const isNotOffboarded = !signOffDate || signOffDate > new Date();
                return isOnboardedInMonth && isNotOffboarded;
            });
            setCrew(travelWagesCrew || []);
            // Initialize travel wages data
            const initialData = {};
            travelWagesCrew.forEach((member)=>{
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
        } finally{
            setLoading(false);
        }
    };
    const fetchHRACrew = async ()=>{
        if (!selectedVessel) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/crew?vesselId=${selectedVessel.vessel_id}`, {
                headers: {
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                }
            });
            if (!response.ok) throw new Error('Failed to fetch crew');
            const allCrew = await response.json();
            const today = new Date();
            // Filter crew who are currently active (onboarded and not yet offboarded)
            const activeCrew = allCrew.filter((member)=>{
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
        } finally{
            setLoading(false);
        }
    };
    const fetchSavedTravelWagesRecords = async ()=>{
        if (!selectedVessel) return;
        setLoadingSavedTravel(true);
        try {
            // Parse month and year from travelMonth (YYYY-MM-DD format)
            const dateObj = new Date(travelMonth);
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();
            const response = await fetch(`/api/travel-wages?vesselId=${selectedVessel.vessel_id}&month=${month}&year=${year}`, {
                headers: {
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                }
            });
            if (response.ok) {
                const records = await response.json();
                // API already returns formatted records with crew_name, travel_wages_amount, etc.
                setSavedTravelWagesRecords(records || []);
            }
        } catch (error) {
            console.error('Error fetching saved travel wages records:', error);
        } finally{
            setLoadingSavedTravel(false);
        }
    };
    const fetchSavedHRARecords = async ()=>{
        if (!selectedVessel) return;
        setLoadingSavedHRA(true);
        try {
            // Parse month and year from hraStartDate (YYYY-MM-DD format)
            const dateObj = new Date(hraStartDate);
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();
            const response = await fetch(`/api/hra?vesselId=${selectedVessel.vessel_id}&month=${month}&year=${year}`, {
                headers: {
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                }
            });
            if (response.ok) {
                const records = await response.json();
                // Map API response to display format - use actual period dates from database
                const formattedRecords = records.map((record)=>({
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
        } finally{
            setLoadingSavedHRA(false);
        }
    };
    const calculatePay = (basicSalary, days)=>{
        if (!basicSalary || days === 0) return 0;
        return basicSalary / 30 * days;
    };
    const calculateDaysBetween = (from, to)=>{
        if (!from || !to) return 0;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const timeDiff = toDate.getTime() - fromDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end date
        return Math.max(0, daysDiff);
    };
    const getCrewStatus = (member)=>{
        const signOnDate = member.sign_on_date ? new Date(member.sign_on_date) : null;
        const signOffDate = member.sign_off_date ? new Date(member.sign_off_date) : null;
        const today = new Date();
        if (signOffDate && signOffDate <= today) {
            return {
                status: 'exit',
                label: 'Offboarded',
                bgColor: 'bg-red-100 text-red-800'
            };
        } else if (signOffDate && signOffDate > today) {
            return {
                status: 'notice',
                label: 'Exit Notice',
                bgColor: 'bg-yellow-100 text-yellow-800'
            };
        } else if (signOnDate && signOnDate <= today) {
            return {
                status: 'onboard',
                label: 'Onboarded',
                bgColor: 'bg-green-100 text-green-800'
            };
        } else {
            return {
                status: 'pending',
                label: 'Pending',
                bgColor: 'bg-gray-100 text-gray-800'
            };
        }
    };
    const handleDaysChange = (crewId, days)=>{
        const crew_member = crew.find((c)=>c.id === crewId);
        const basicSalary = crew_member?.basic_salary || 0;
        const calculated_amount = calculatePay(basicSalary, days);
        setTravelWagesData((prev)=>({
                ...prev,
                [crewId]: {
                    crew_id: crewId,
                    days,
                    calculated_amount
                }
            }));
    };
    const handleSaveTravelWages = async ()=>{
        if (!selectedVessel) return;
        const payload = Object.values(travelWagesData).filter((d)=>d.days > 0);
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
            alert(error.message || 'Failed to save travel wages');
        } finally{
            setSavingTravel(false);
        }
    };
    const handleClearAll = ()=>{
        if (confirm('Are you sure you want to clear all travel wages entries?')) {
            const cleared = {};
            crew.forEach((member)=>{
                cleared[member.id] = {
                    crew_id: member.id,
                    days: 0,
                    calculated_amount: 0
                };
            });
            setTravelWagesData(cleared);
        }
    };
    const handleClearHRAAll = ()=>{
        if (confirm('Are you sure you want to clear all HRA entries?')) {
            const cleared = {};
            crew.forEach((member)=>{
                cleared[member.id] = {
                    crew_id: member.id,
                    days: 0,
                    calculated_amount: 0
                };
            });
            setHraData(cleared);
        }
    };
    const handleDeleteHRA = async (hraEntryId)=>{
        if (!confirm('Are you sure you want to delete this HRA entry? This will recalculate the monthly HRA total.')) {
            return;
        }
        try {
            const response = await fetch('/api/hra', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: hraEntryId
                })
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
            alert(error.message || 'Failed to delete HRA entry');
        }
    };
    const handleSaveHRA = async ()=>{
        if (!selectedVessel) return;
        const payload = Object.values(hraData).filter((d)=>d.days > 0);
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
            const enhancedPayload = payload.map((p)=>({
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
                    alert(errorData.error || 'HRA entry with overlapping dates already exists. Please choose different dates or delete the existing entry first.');
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
            alert(error.message || 'Failed to save HRA');
        } finally{
            setSavingHRA(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-gray-50 min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-gray-900 mb-2",
                            children: "Travel Wages & HRA Management"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 499,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: "Manage travel allowances and HRA for active crew members"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 500,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                    lineNumber: 498,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('travel-wages'),
                            className: `px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'travel-wages' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`,
                            children: "💰 Travel Wages"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 505,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('hra'),
                            className: `px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'hra' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`,
                            children: "⚠️ HRA (High Risk Area)"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 515,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                    lineNumber: 504,
                    columnNumber: 17
                }, this),
                activeTab === 'travel-wages' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 items-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2/5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                        children: "Travel Allowance Month"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                        lineNumber: 532,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: travelMonth,
                                        onChange: (e)=>setTravelMonth(e.target.value),
                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                        lineNumber: 535,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                lineNumber: 531,
                                columnNumber: 29
                            }, this),
                            selectedVessel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 text-sm text-gray-600",
                                children: [
                                    "Vessel: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-gray-900",
                                        children: selectedVessel.vessel_name
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                        lineNumber: 544,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                lineNumber: 543,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                        lineNumber: 530,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                    lineNumber: 529,
                    columnNumber: 21
                }, this),
                activeTab === 'travel-wages' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-b border-gray-200 bg-gray-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold text-gray-900",
                                    children: [
                                        "Travel Wages - ",
                                        new Date(travelMonth).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long'
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 555,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 mt-1",
                                    children: "💡 Only for newly onboarded crew in this month. Pay = (Basic Salary / 30) × No. of Days"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 556,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 554,
                            columnNumber: 25
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 text-center text-gray-500",
                            children: "Loading newly onboarded crew..."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 562,
                            columnNumber: 29
                        }, this) : crew.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 text-center text-gray-500",
                            children: "No newly onboarded crew members found for this month"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 564,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full divide-y divide-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "bg-white",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                            children: "Crew Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 573,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                            children: "Passport No"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 576,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                            children: "Rank"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 579,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                            children: "No. of Days"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 585,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                            children: "Pay ($)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 588,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 571,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "bg-white divide-y divide-gray-200",
                                                children: crew.map((member)=>{
                                                    const travelData = travelWagesData[member.id];
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-gray-50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                                children: member.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 598,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600",
                                                                children: member.passport_number || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 601,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600",
                                                                children: member.rank || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 604,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 whitespace-nowrap",
                                                                children: (()=>{
                                                                    const status = getCrewStatus(member);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor}`,
                                                                        children: status.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 611,
                                                                        columnNumber: 69
                                                                    }, this);
                                                                })()
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 607,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 whitespace-nowrap text-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: travelData?.days || 0,
                                                                    onChange: (e)=>handleDaysChange(member.id, parseInt(e.target.value) || 0),
                                                                    className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-center",
                                                                    children: [
                                                                        0,
                                                                        1,
                                                                        2,
                                                                        3,
                                                                        4
                                                                    ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: day,
                                                                            children: day
                                                                        }, day, false, {
                                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                            lineNumber: 624,
                                                                            columnNumber: 69
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 618,
                                                                    columnNumber: 61
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 617,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right",
                                                                children: [
                                                                    "$",
                                                                    travelData?.calculated_amount && parseFloat(String(travelData.calculated_amount)).toFixed(2) || '0.00'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 630,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, member.id, true, {
                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                        lineNumber: 597,
                                                        columnNumber: 53
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 593,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                        lineNumber: 570,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 569,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleClearAll,
                                            className: "px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition-colors",
                                            children: "✕ Clear All"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 642,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveTravelWages,
                                            disabled: savingTravel,
                                            className: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50",
                                            children: savingTravel ? '⏳ Saving...' : '💾 Save'
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 648,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 641,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-gray-900 mb-4",
                                            children: [
                                                "Saved Travel Wages Records for ",
                                                new Date(travelMonth).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long'
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 659,
                                            columnNumber: 37
                                        }, this),
                                        loadingSavedTravel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 text-center text-gray-500",
                                            children: "Loading saved travel wages records..."
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 662,
                                            columnNumber: 41
                                        }, this) : savedTravelWagesRecords.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 text-center text-gray-500 bg-gray-50 rounded-lg",
                                            children: "No saved travel wages records for this month"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 664,
                                            columnNumber: 41
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-x-auto bg-white rounded-lg shadow",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        className: "bg-gray-100 border-b border-gray-200",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase",
                                                                    children: "Crew Member"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 672,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase",
                                                                    children: "Days"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 673,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase",
                                                                    children: "Travel Wages Amount"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 674,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 671,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                        lineNumber: 670,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        className: "divide-y divide-gray-200",
                                                        children: savedTravelWagesRecords.map((record)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "hover:bg-gray-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                                        children: record.crew_name || record.crew_member_id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 680,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900",
                                                                        children: record.days_calculated || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 683,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right",
                                                                        children: [
                                                                            "$",
                                                                            parseFloat(String(record.travel_wages_amount || 0)).toFixed(2)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 686,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, record.id, true, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 679,
                                                                columnNumber: 57
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                        lineNumber: 677,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 669,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 668,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 658,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                    lineNumber: 553,
                    columnNumber: 21
                }, this),
                activeTab === 'hra' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 items-end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "From Date"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 708,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: hraStartDate,
                                                onChange: (e)=>{
                                                    setHraStartDate(e.target.value);
                                                    // Auto-update HRA data when dates change
                                                    const days = calculateDaysBetween(e.target.value, hraEndDate);
                                                    const updated = {};
                                                    crew.forEach((member)=>{
                                                        const basicSalary = member.basic_salary || 0;
                                                        updated[member.id] = {
                                                            crew_id: member.id,
                                                            days,
                                                            calculated_amount: calculatePay(basicSalary, days)
                                                        };
                                                    });
                                                    setHraData(updated);
                                                },
                                                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 711,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                        lineNumber: 707,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "To Date"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 733,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: hraEndDate,
                                                onChange: (e)=>{
                                                    setHraEndDate(e.target.value);
                                                    // Auto-update HRA data when dates change
                                                    const days = calculateDaysBetween(hraStartDate, e.target.value);
                                                    const updated = {};
                                                    crew.forEach((member)=>{
                                                        const basicSalary = member.basic_salary || 0;
                                                        updated[member.id] = {
                                                            crew_id: member.id,
                                                            days,
                                                            calculated_amount: calculatePay(basicSalary, days)
                                                        };
                                                    });
                                                    setHraData(updated);
                                                },
                                                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 736,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                        lineNumber: 732,
                                        columnNumber: 33
                                    }, this),
                                    selectedVessel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: [
                                            "Vessel: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-gray-900",
                                                children: selectedVessel.vessel_name
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 759,
                                                columnNumber: 49
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                        lineNumber: 758,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                lineNumber: 706,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 705,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 border-b border-gray-200 bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-semibold text-gray-900",
                                            children: [
                                                "⚠️ HRA - High Risk Area (",
                                                hraStartDate,
                                                " to ",
                                                hraEndDate,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 768,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4 mt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "💡 HRA = (Basic Salary / 30) × No. of Days"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 770,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-blue-100 border border-blue-300 rounded-lg px-3 py-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-semibold text-blue-900",
                                                        children: [
                                                            "Days Calculated: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg text-blue-700",
                                                                children: calculateDaysBetween(hraStartDate, hraEndDate)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 775,
                                                                columnNumber: 62
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                        lineNumber: 774,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 773,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 769,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 767,
                                    columnNumber: 29
                                }, this),
                                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 text-center text-gray-500",
                                    children: "Loading active crew..."
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 782,
                                    columnNumber: 33
                                }, this) : crew.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 text-center text-gray-500",
                                    children: "No active crew members found"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                    lineNumber: 784,
                                    columnNumber: 33
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-x-auto",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "w-full divide-y divide-gray-200",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        className: "bg-white",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                    children: "Crew Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 793,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                    children: "Passport No"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 796,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                    children: "Rank"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 799,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                    children: "No. of Days"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 802,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                    children: "Basic ($)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 805,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                                    children: "HRA ($)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 808,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                            lineNumber: 792,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                        lineNumber: 791,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        className: "bg-white divide-y divide-gray-200",
                                                        children: crew.map((member)=>{
                                                            const hraInfo = hraData[member.id];
                                                            // Skip crew members not eligible for this HRA period
                                                            if (!hraInfo) return null;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "hover:bg-gray-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                                        children: member.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 821,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600",
                                                                        children: member.passport_number || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 824,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600",
                                                                        children: member.rank || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 827,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900",
                                                                        children: hraInfo?.days || 0
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 830,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right",
                                                                        children: [
                                                                            "$",
                                                                            member.basic_salary && parseFloat(String(member.basic_salary)).toFixed(2) || '0.00'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 833,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right",
                                                                        children: [
                                                                            "$",
                                                                            hraInfo?.calculated_amount && parseFloat(String(hraInfo.calculated_amount)).toFixed(2) || '0.00'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 836,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, member.id, true, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 820,
                                                                columnNumber: 57
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                        lineNumber: 813,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                lineNumber: 790,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 789,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleClearHRAAll,
                                                    className: "px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition-colors",
                                                    children: "✕ Clear All"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 848,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleSaveHRA,
                                                    disabled: savingHRA,
                                                    className: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50",
                                                    children: savingHRA ? '⏳ Saving...' : '💾 Save'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 854,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 847,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-bold text-gray-900 mb-4",
                                                    children: "Saved HRA Records for Current Month"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 865,
                                                    columnNumber: 41
                                                }, this),
                                                loadingSavedHRA ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-6 text-center text-gray-500",
                                                    children: "Loading saved HRA records..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 868,
                                                    columnNumber: 45
                                                }, this) : savedHRARecords.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-6 text-center text-gray-500 bg-gray-50 rounded-lg",
                                                    children: "No saved HRA records for this month"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 870,
                                                    columnNumber: 45
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "overflow-x-auto bg-white rounded-lg shadow",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        className: "w-full",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                className: "bg-gray-100 border-b border-gray-200",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase",
                                                                            children: "Crew Member"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                            lineNumber: 878,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase",
                                                                            children: "Date Range"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                            lineNumber: 879,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase",
                                                                            children: "Days"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                            lineNumber: 880,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase",
                                                                            children: "HRA Amount"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                            lineNumber: 881,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase",
                                                                            children: "Action"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                            lineNumber: 882,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                    lineNumber: 877,
                                                                    columnNumber: 57
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 876,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                className: "divide-y divide-gray-200",
                                                                children: savedHRARecords.map((record)=>{
                                                                    // Fallback: calculate days from date range if not stored
                                                                    const displayDays = record.days_calculated && record.days_calculated > 0 ? record.days_calculated : calculateDaysBetween(new Date(record.hra_period_start).toISOString().split('T')[0], new Date(record.hra_period_end).toISOString().split('T')[0]);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        className: "hover:bg-gray-50",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                                                children: record.crew_name || record.crew_member_id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                                lineNumber: 897,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600",
                                                                                children: [
                                                                                    new Date(record.hra_period_start).toLocaleDateString(),
                                                                                    " - ",
                                                                                    new Date(record.hra_period_end).toLocaleDateString()
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                                lineNumber: 900,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900",
                                                                                children: displayDays
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                                lineNumber: 903,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right",
                                                                                children: [
                                                                                    "$",
                                                                                    parseFloat(String(record.hra_amount || 0)).toFixed(2)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                                lineNumber: 906,
                                                                                columnNumber: 65
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-6 py-4 whitespace-nowrap text-sm text-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>handleDeleteHRA(record.id),
                                                                                    className: "px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium transition-colors",
                                                                                    children: "🗑️ Delete"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                                    lineNumber: 910,
                                                                                    columnNumber: 69
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                                lineNumber: 909,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        ]
                                                                    }, record.id, true, {
                                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                        lineNumber: 896,
                                                                        columnNumber: 61
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                                lineNumber: 885,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                        lineNumber: 875,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                                    lineNumber: 874,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                                            lineNumber: 864,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
                            lineNumber: 766,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
            lineNumber: 496,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/travel-wages-hra/page.tsx",
        lineNumber: 495,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=app_dashboard_travel-wages-hra_page_tsx_79fb8b27._.js.map