'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { formatDateDDMMYYYY } from '@/lib/formatters';
import { processContractWithOCR } from '@crewport/ocr-extractor';
import { useVessel } from '@/app/context/VesselContext';

interface Vessel {
    id: number;
    vessel_name: string;
}

interface Rank {
    id: number;
    rank_name: string;
    rank_code: string;
}

interface Port {
    id: number;
    name: string;
    code: string;
    country_code?: string;
    zone_code?: string;
}

interface CrewEarning {
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

interface CrewMember {
    id: number;
    name: string;
    passport_number: string | null;
    rank: string | null;
    nationality: string | null;
    vessel_id: number;
    vessels: Vessel;
    onboarding_status: string;
    crew_status: string | null;
    date_of_birth: string | null;
    sign_on_date: string | null;
    sign_off_date: string | null;
    sign_on_port: string | null;
    sign_off_port: string | null;
    exit_type: string | null;
    exit_remarks: string | null;
    contract_file: string | null;
    crew_earnings: CrewEarning[];
    // Flattened fields for display (from first earnings record)
    basic_salary: number | null;
    fixed_overtime: number | null;
    leave_wages: number | null;
    other_allowances: number | null;
    travel_wages: number | null;
    hra: number | null;
    joining_expenses: number | null;
    onboard_allowance_short_manning: number | null;
    total_earnings: number | null;
}

export default function CrewManagement() {
    const { selectedVessel } = useVessel();
    const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [ports, setPorts] = useState<Port[]>([]);
    const [crew, setCrew] = useState<CrewMember[]>([]);
    const [filteredCrew, setFilteredCrew] = useState<CrewMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [ocrProcessing, setOcrProcessing] = useState(false);
    const [contractFileUrl, setContractFileUrl] = useState<string>('');
    const [userRole, setUserRole] = useState('VESSEL');
    const [companyId, setCompanyId] = useState(1); // MOCK FOR NOW
    const [userId, setUserId] = useState(1); // MOCK FOR NOW
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
    const [isEditingCrewDetails, setIsEditingCrewDetails] = useState(false);
    const [isEditingExit, setIsEditingExit] = useState(false);
    const [crewEditData, setCrewEditData] = useState({
        name: '',
        passport_number: '',
        nationality: '',
        date_of_birth: '',
        rank: '',
        sign_on_date: '',
        sign_on_port: '',
        basic_salary: '',
        fixed_overtime: '',
        leave_wages: '',
        other_allowances: '',
        joining_expenses: '',
        onboard_allowance_short_manning: ''
    });
    const [isCrewDetailsSaving, setIsCrewDetailsSaving] = useState(false);
    const [exitEditData, setExitEditData] = useState({
        sign_off_date: '',
        sign_off_port: '',
        exit_type: '',
        exit_remarks: ''
    });
    const [isExitSaving, setIsExitSaving] = useState(false);
    
    // Sorting states
    const [sortBy, setSortBy] = useState<'name' | 'passport_number' | 'rank' | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [vesselFilter, setVesselFilter] = useState('');
    const [editedSalary, setEditedSalary] = useState<{
        basic_salary: string;
        fixed_overtime: string;
        leave_wages: string;
        other_allowances: string;
        travel_wages: string;
        hra: string;
        joining_expenses: string;
        onboard_allowance_short_manning: string;
    } | null>(null);
    const [portSearchQuery, setPortSearchQuery] = useState('');
    const [showPortDropdown, setShowPortDropdown] = useState(false);
    const [rankSearchQuery, setRankSearchQuery] = useState('');
    const [showRankDropdown, setShowRankDropdown] = useState(false);
    const [isOcrDataPopulated, setIsOcrDataPopulated] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Info
        passport_number: '',
        name: '',
        nationality: '',
        date_of_birth: '',
        contact_number: '',
        rank: '',
        position: '', // Added position field for database constraint
        vessel_id: '',
        sign_on_date: new Date().toISOString().split('T')[0],
        sign_on_port: '',
        contract_duration_months: '',
        tentative_sign_off_date: '',
        contract_file: null as File | null,
        // Salary Info
        basic_salary: '',
        fixed_overtime: '',
        leave_wages: '',
        other_allowances: '',
        travel_wages: '',
        hra: '',
        joining_expenses: '',
        onboard_allowance_short_manning: '',
        total_earnings: ''
    });

    const fetchData = async () => {
        if (!selectedVessel) return;
        
        setLoading(true);
        try {
            const [vesselsRes, ranksRes, portsRes, crewRes] = await Promise.all([
                fetch('/api/vessels'),
                fetch('/api/masters/ranks'),
                fetch('/api/masters/ports'),
                fetch('/api/crew', {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                })
            ]);

            if (vesselsRes.ok) setVessels(await vesselsRes.json());
            if (ranksRes.ok) {
                const ranksData = await ranksRes.json();
                setRanks(ranksData);
            }
            if (portsRes.ok) {
                const portsData = await portsRes.json();
                setPorts(portsData.data || []);
            }
            if (crewRes.ok) {
                const crewData = await crewRes.json();
                setCrew(crewData);
                setFilteredCrew(crewData);
            }
        } catch (error) {
            // Error fetching data - handled silently
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
        fetchData();
    }, [selectedVessel]);

    // Auto-populate vessel field with selected vessel from context
    useEffect(() => {
        if (selectedVessel) {
            setFormData(prev => ({
                ...prev,
                vessel_id: selectedVessel.vessel_id.toString()
            }));
            // Auto-filter crew list by selected vessel when in list tab
            if (activeTab === 'list') {
                setVesselFilter(selectedVessel.vessel_id.toString());
            }
        }
    }, [selectedVessel, activeTab]);

    // Auto-apply filters when crew data or filter criteria change
    useEffect(() => {
        applyFilters();
    }, [crew, vesselFilter, searchQuery, statusFilter, startDate, endDate]);

    const calculateTotalEarnings = (data: typeof formData) => {
        const salaryFields = [
            'basic_salary',
            'fixed_overtime',
            'leave_wages',
            'other_allowances',
            'travel_wages',
            'hra',
            'joining_expenses',
            'onboard_allowance_short_manning'
        ];

        const total = salaryFields.reduce((sum, field) => {
            const value = parseFloat(data[field as keyof typeof formData] as string) || 0;
            return sum + value;
        }, 0);

        return total > 0 ? total.toFixed(2) : '';
    };

    const calculateTentativeSignOffDate = (signOnDate: string, contractMonths: string): string => {
        if (!signOnDate || !contractMonths) return '';
        try {
            const months = parseInt(contractMonths);
            if (isNaN(months) || months <= 0) return '';
            
            const date = new Date(signOnDate);
            date.setMonth(date.getMonth() + months);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    const isAtLeast18YearsOld = (dobString: string): { valid: boolean; age: number } => {
        if (!dobString) return { valid: false, age: 0 };
        
        try {
            const dob = new Date(dobString);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            
            // Adjust age if birthday hasn't occurred this year
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            return { valid: age >= 18, age };
        } catch {
            return { valid: false, age: 0 };
        }
    };

    const isValidSignOnDate = (dateString: string): { valid: boolean; message: string } => {
        if (!dateString) return { valid: false, message: 'Sign on date is required' };
        try {
            const signOnDate = new Date(dateString);
            const today = new Date();
            
            // Check if date is in the future
            if (signOnDate > today) {
                return { valid: false, message: 'Sign on date cannot be a future date' };
            }
            
            // Check if date is in the same month and year
            if (signOnDate.getFullYear() !== today.getFullYear() || signOnDate.getMonth() !== today.getMonth()) {
                const monthName = signOnDate.toLocaleString('default', { month: 'long' });
                const currentMonth = today.toLocaleString('default', { month: 'long' });
                return { valid: false, message: `Sign on date must be in the current month (${currentMonth}), not ${monthName}` };
            }
            
            return { valid: true, message: '' };
        } catch {
            return { valid: false, message: 'Invalid sign on date' };
        }
    };

    const getFilteredPorts = () => {
        if (!portSearchQuery.trim()) return ports;
        const query = portSearchQuery.toLowerCase();
        return ports.filter(port => 
            port.name.toLowerCase().includes(query) || 
            port.code?.toLowerCase().includes(query)
        );
    };

    const getFilteredRanks = () => {
        if (!rankSearchQuery.trim()) return ranks;
        const query = rankSearchQuery.toLowerCase();
        return ranks.filter(rank => 
            rank.rank_name.toLowerCase().includes(query) || 
            rank.rank_code?.toLowerCase().includes(query)
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let value = e.target.value;
        
        // Phone number validation - only allow digits and + symbol
        if (e.target.name === 'contact_number') {
            // Remove any characters that are not digits or + symbol
            value = value.replace(/[^\d+]/g, '');
            // Ensure + only appears at the beginning if present
            if (value.includes('+')) {
                const plusIndex = value.indexOf('+');
                if (plusIndex > 0) {
                    // Remove + from middle and add at beginning
                    value = '+' + value.replace(/\+/g, '');
                }
                // Ensure only one + at the beginning
                value = '+' + value.replace(/\+/g, '');
            }
        }

        const newFormData = {
            ...formData,
            [e.target.name]: value
        };

        // Auto-calculate total earnings if this is a salary field
        const salaryFields = ['basic_salary', 'fixed_overtime', 'leave_wages', 'other_allowances', 'travel_wages', 'hra', 'joining_expenses', 'onboard_allowance_short_manning'];
        if (salaryFields.includes(e.target.name)) {
            newFormData.total_earnings = calculateTotalEarnings(newFormData);
        }

        // Auto-calculate tentative sign-off date if contract duration or sign-on date changes
        if (e.target.name === 'contract_duration_months' || e.target.name === 'sign_on_date') {
            newFormData.tentative_sign_off_date = calculateTentativeSignOffDate(
                e.target.name === 'sign_on_date' ? e.target.value : newFormData.sign_on_date,
                e.target.name === 'contract_duration_months' ? e.target.value : newFormData.contract_duration_months
            );
        }

        setFormData(newFormData);
    };

    const handleContractUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate vessel is selected
        if (!selectedVessel) {
            alert('Please select a vessel first');
            return;
        }

        // Validate passport number is provided
        if (!formData.passport_number.trim()) {
            alert('Please enter Passport Number first');
            return;
        }

        // Validate file type (images only for OCR)
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG/PNG)');
            return;
        }

        // Check if OCR data was already populated - warn user
        if (isOcrDataPopulated) {
            const shouldClear = window.confirm(
                'Previous OCR data was found. Uploading a new file will replace the existing populated fields (except Passport Number). Do you want to continue?'
            );
            if (!shouldClear) return;

            // Clear previous OCR populated fields but keep Passport Number
            setFormData(prev => ({
                ...prev,
                name: '',
                date_of_birth: '',
                nationality: '',
                basic_salary: '',
                fixed_overtime: '',
                leave_wages: '',
                other_allowances: '',
                travel_wages: '',
                hra: '',
                joining_expenses: '',
                onboard_allowance_short_manning: '',
                total_earnings: ''
            }));
            setContractFileUrl('');
            setIsOcrDataPopulated(false);
        }

        setFormData({
            ...formData,
            contract_file: file
        });

        // Upload file to server with passport number as filename
        setOcrProcessing(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('passportNumber', formData.passport_number);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: uploadFormData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error || 'Failed to upload file');
            }

            // Store the file URL for display and submission
            const fileUrl = uploadData.url;
            setContractFileUrl(fileUrl);

            // Process OCR (optional - doesn't block crew creation)
            try {
                const { text, salaryData, error } = await processContractWithOCR(file);

                console.log('[OCR] Extracted data:', salaryData);
                console.log('[OCR] Error:', error);

                if (error || !salaryData) {
                    // OCR failed or no data extracted
                    alert('Contract file uploaded successfully. However, OCR could not extract employee data. Please fill in the details manually.');
                    setIsOcrDataPopulated(false);
                    return;
                }

                // Check if salaryData has meaningful contract data
                // Require: at least ONE personal field (name/DOB/nationality) AND at least ONE salary field
                const hasPersonalData = !!(
                    salaryData.full_name ||
                    salaryData.date_of_birth ||
                    salaryData.nationality
                );
                
                const hasSalaryData = !!(
                    salaryData.basic_salary ||
                    salaryData.fixed_overtime ||
                    salaryData.leave_wages ||
                    salaryData.other_allowances ||
                    salaryData.travel_wages ||
                    salaryData.hra ||
                    salaryData.joining_expenses ||
                    salaryData.onboard_allowance_short_manning
                );

                // Must have both personal data and salary data to be considered valid contract
                const hasExtractedData = hasPersonalData && hasSalaryData;

                if (!hasExtractedData) {
                    alert('Contract file uploaded successfully. However, no employee data could be extracted. Please fill in the details manually.');
                    setIsOcrDataPopulated(false);
                    return;
                }

                // Auto-fill fields with extracted data
                const updatedData = {
                    name: salaryData.full_name ? salaryData.full_name : formData.name,
                    date_of_birth: salaryData.date_of_birth ? salaryData.date_of_birth : formData.date_of_birth,
                    nationality: salaryData.nationality ? salaryData.nationality : formData.nationality,
                    basic_salary: salaryData.basic_salary ? String(salaryData.basic_salary) : formData.basic_salary,
                    fixed_overtime: salaryData.fixed_overtime ? String(salaryData.fixed_overtime) : formData.fixed_overtime,
                    leave_wages: salaryData.leave_wages ? String(salaryData.leave_wages) : formData.leave_wages,
                    other_allowances: salaryData.other_allowances ? String(salaryData.other_allowances) : formData.other_allowances,
                    travel_wages: salaryData.travel_wages ? String(salaryData.travel_wages) : formData.travel_wages,
                    hra: salaryData.hra ? String(salaryData.hra) : formData.hra,
                    joining_expenses: salaryData.joining_expenses ? String(salaryData.joining_expenses) : formData.joining_expenses,
                    onboard_allowance_short_manning: salaryData.onboard_allowance_short_manning ? String(salaryData.onboard_allowance_short_manning) : formData.onboard_allowance_short_manning,
                };

                console.log('[OCR] Updated form data:', updatedData);

                setFormData(prev => ({
                    ...prev,
                    ...updatedData,
                    total_earnings: calculateTotalEarnings({ ...prev, ...updatedData })
                }));
                setIsOcrDataPopulated(true);
                alert('Contract uploaded successfully! Employee details and salary fields have been auto-filled.');
            } catch (ocrError) {
                // OCR processing failed
                console.error('[OCR] Processing error:', ocrError);
                alert('Contract file uploaded successfully. However, OCR processing failed. Please fill in the employee details manually.');
                setIsOcrDataPopulated(false);
            }
        } catch (error) {
            alert((error as Error).message || 'Error uploading contract');
            setIsOcrDataPopulated(false);
        } finally {
            setOcrProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            alert('Crew name is required');
            return;
        }
        if (!formData.vessel_id) {
            alert('Please select a vessel');
            return;
        }

        // Validate age (at least 18 years old)
        if (formData.date_of_birth) {
            const { valid: isValidAge, age } = isAtLeast18YearsOld(formData.date_of_birth);
            if (!isValidAge) {
                alert(`Crew member must be at least 18 years old. Current age: ${age} years.`);
                return;
            }
        }

        // Validate sign on date (must be same month and not future date)
        if (formData.sign_on_date) {
            const { valid: isValidDate, message } = isValidSignOnDate(formData.sign_on_date);
            if (!isValidDate) {
                alert(message);
                return;
            }
        }

        setIsSubmitLoading(true);

        try {
            if (!selectedVessel) {
                alert('Please select a vessel first');
                return;
            }

            // Create payload without contract_file (used only for OCR)
            const { contract_file, ...dataWithoutFile } = formData;
            const payload = {
                ...dataWithoutFile,
                contract_file: contractFileUrl, // Include the uploaded file URL
                company_id: companyId,
                created_by: userId
            };

            const response = await fetch('/api/crew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add crew member');
            }

            alert('Crew member added successfully. Pending admin verification.');

            // Refresh crew list
            fetchData();

            // Reset form
            setFormData({
                passport_number: '',
                name: '',
                nationality: '',
                date_of_birth: '',
                contact_number: '',
                rank: '',
                position: '', // Reset position field
                vessel_id: selectedVessel?.vessel_id.toString() || '',
                sign_on_date: new Date().toISOString().split('T')[0],
                sign_on_port: '',
                contract_duration_months: '',
                tentative_sign_off_date: '',
                contract_file: null,
                basic_salary: '',
                fixed_overtime: '',
                leave_wages: '',
                other_allowances: '',
                travel_wages: '',
                hra: '',
                joining_expenses: '',
                onboard_allowance_short_manning: '',
                total_earnings: ''
            });

            setContractFileUrl('');
            setIsOcrDataPopulated(false);
        } catch (error) {
            console.error(error);
            alert((error as Error).message || 'Error adding crew member');
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        if (!selectedVessel) return;
        
        setApprovingId(id);
        try {
            const response = await fetch(`/api/crew/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    status: 'APPROVED',
                    crew_status: 'ACTIVE',
                    verified_by: userId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to approve crew member');
            }

            alert('Crew member approved successfully!');
            
            // Refresh crew list
            fetchData();
            
            // Also update local state for immediate UI update
            const updatedCrew = crew.map(member =>
                member.id === id ? { ...member, onboarding_status: 'APPROVED', crew_status: 'ACTIVE' } : member
            );
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);
            
            // Close modal
            setSelectedCrew(null);
        } catch (error) {
            alert((error as Error).message || 'Error approving crew member');
        } finally {
            setApprovingId(null);
        }
    };

    const handleEditExit = () => {
        if (selectedCrew) {
            setExitEditData({
                sign_off_date: selectedCrew.sign_off_date ? selectedCrew.sign_off_date.split('T')[0] : '',
                sign_off_port: selectedCrew.sign_off_port || '',
                exit_type: selectedCrew.exit_type || '',
                exit_remarks: selectedCrew.exit_remarks || ''
            });
            setIsEditingExit(true);
        }
    };

    const handleCancelEditExit = () => {
        setIsEditingExit(false);
        setExitEditData({
            sign_off_date: '',
            sign_off_port: '',
            exit_type: '',
            exit_remarks: ''
        });
    };

    const handleSaveExit = async () => {
        if (!selectedCrew || !selectedVessel) return;
        
        // Validate that at least sign_off_date is provided
        if (!exitEditData.sign_off_date.trim()) {
            alert('Please enter an exit date');
            return;
        }

        // Validate exit type
        if (!exitEditData.exit_type.trim()) {
            alert('Please select an exit type');
            return;
        }

        // Validate remarks for break contract
        if (exitEditData.exit_type === 'BREAK_CONTRACT' && !exitEditData.exit_remarks.trim()) {
            alert('Please provide remarks for contract break');
            return;
        }

        setIsExitSaving(true);
        try {
            const response = await fetch(`/api/crew/${selectedCrew.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    sign_off_date: exitEditData.sign_off_date,
                    sign_off_port: exitEditData.sign_off_port || '',
                    exit_type: exitEditData.exit_type,
                    exit_remarks: exitEditData.exit_remarks || '',
                    crew_status: 'COMPLETED'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to update exit details');
            }

            alert('Exit details updated successfully!');
            
            // Update the selected crew state
            setSelectedCrew({
                ...selectedCrew,
                sign_off_date: exitEditData.sign_off_date,
                sign_off_port: exitEditData.sign_off_port,
                exit_type: exitEditData.exit_type,
                exit_remarks: exitEditData.exit_remarks,
                crew_status: 'COMPLETED'
            });

            // Update crew list
            const updatedCrew = crew.map(member =>
                member.id === selectedCrew.id 
                    ? { 
                        ...member, 
                        sign_off_date: exitEditData.sign_off_date, 
                        sign_off_port: exitEditData.sign_off_port,
                        exit_type: exitEditData.exit_type,
                        exit_remarks: exitEditData.exit_remarks,
                        crew_status: 'COMPLETED'
                      }
                    : member
            );
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);

            setIsEditingExit(false);
        } catch (error) {
            alert((error as Error).message || 'Error updating exit details');
        } finally {
            setIsExitSaving(false);
        }
    };

    const handleEditCrewDetails = () => {
        if (selectedCrew) {
            setCrewEditData({
                name: selectedCrew.name || '',
                passport_number: selectedCrew.passport_number || '',
                nationality: selectedCrew.nationality || '',
                date_of_birth: selectedCrew.date_of_birth ? selectedCrew.date_of_birth.split('T')[0] : '',
                rank: selectedCrew.rank || '',
                sign_on_date: selectedCrew.sign_on_date ? selectedCrew.sign_on_date.split('T')[0] : '',
                sign_on_port: selectedCrew.sign_on_port || '',
                basic_salary: selectedCrew.basic_salary ? String(selectedCrew.basic_salary) : '',
                fixed_overtime: selectedCrew.fixed_overtime ? String(selectedCrew.fixed_overtime) : '',
                leave_wages: selectedCrew.leave_wages ? String(selectedCrew.leave_wages) : '',
                other_allowances: selectedCrew.other_allowances ? String(selectedCrew.other_allowances) : '',
                joining_expenses: selectedCrew.joining_expenses ? String(selectedCrew.joining_expenses) : '',
                onboard_allowance_short_manning: selectedCrew.onboard_allowance_short_manning ? String(selectedCrew.onboard_allowance_short_manning) : ''
            });
            setIsEditingCrewDetails(true);
        }
    };

    const handleCancelEditCrewDetails = () => {
        setIsEditingCrewDetails(false);
        setCrewEditData({
            name: '',
            passport_number: '',
            nationality: '',
            date_of_birth: '',
            rank: '',
            sign_on_date: '',
            sign_on_port: '',
            basic_salary: '',
            fixed_overtime: '',
            leave_wages: '',
            other_allowances: '',
            joining_expenses: '',
            onboard_allowance_short_manning: ''
        });
    };

    const handleSaveCrewDetails = async () => {
        if (!selectedCrew || !selectedVessel) return;

        // Validate required fields
        if (!crewEditData.name.trim()) {
            alert('Please enter crew name');
            return;
        }

        setIsCrewDetailsSaving(true);
        try {
            const response = await fetch(`/api/crew/${selectedCrew.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    name: crewEditData.name,
                    passport_number: crewEditData.passport_number,
                    nationality: crewEditData.nationality,
                    date_of_birth: crewEditData.date_of_birth,
                    rank: crewEditData.rank,
                    sign_on_date: crewEditData.sign_on_date,
                    sign_on_port: crewEditData.sign_on_port,
                    basic_salary: crewEditData.basic_salary ? parseFloat(crewEditData.basic_salary) : null,
                    fixed_overtime: crewEditData.fixed_overtime ? parseFloat(crewEditData.fixed_overtime) : null,
                    leave_wages: crewEditData.leave_wages ? parseFloat(crewEditData.leave_wages) : null,
                    other_allowances: crewEditData.other_allowances ? parseFloat(crewEditData.other_allowances) : null,
                    joining_expenses: crewEditData.joining_expenses ? parseFloat(crewEditData.joining_expenses) : null,
                    onboard_allowance_short_manning: crewEditData.onboard_allowance_short_manning ? parseFloat(crewEditData.onboard_allowance_short_manning) : null
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to update crew details');
            }

            alert('Crew details updated successfully!');
            
            // Update the selected crew state
            setSelectedCrew({
                ...selectedCrew,
                name: crewEditData.name,
                passport_number: crewEditData.passport_number,
                nationality: crewEditData.nationality,
                date_of_birth: crewEditData.date_of_birth,
                rank: crewEditData.rank,
                sign_on_date: crewEditData.sign_on_date,
                sign_on_port: crewEditData.sign_on_port,
                basic_salary: crewEditData.basic_salary ? parseFloat(crewEditData.basic_salary) : null,
                fixed_overtime: crewEditData.fixed_overtime ? parseFloat(crewEditData.fixed_overtime) : null,
                leave_wages: crewEditData.leave_wages ? parseFloat(crewEditData.leave_wages) : null,
                other_allowances: crewEditData.other_allowances ? parseFloat(crewEditData.other_allowances) : null,
                joining_expenses: crewEditData.joining_expenses ? parseFloat(crewEditData.joining_expenses) : null,
                onboard_allowance_short_manning: crewEditData.onboard_allowance_short_manning ? parseFloat(crewEditData.onboard_allowance_short_manning) : null
            });

            // Update crew list
            const updatedCrew = crew.map(member =>
                member.id === selectedCrew.id 
                    ? { 
                        ...member, 
                        name: crewEditData.name,
                        passport_number: crewEditData.passport_number,
                        nationality: crewEditData.nationality,
                        date_of_birth: crewEditData.date_of_birth,
                        rank: crewEditData.rank,
                        sign_on_date: crewEditData.sign_on_date,
                        sign_on_port: crewEditData.sign_on_port,
                        basic_salary: crewEditData.basic_salary ? parseFloat(crewEditData.basic_salary) : null,
                        fixed_overtime: crewEditData.fixed_overtime ? parseFloat(crewEditData.fixed_overtime) : null,
                        leave_wages: crewEditData.leave_wages ? parseFloat(crewEditData.leave_wages) : null,
                        other_allowances: crewEditData.other_allowances ? parseFloat(crewEditData.other_allowances) : null,
                        joining_expenses: crewEditData.joining_expenses ? parseFloat(crewEditData.joining_expenses) : null,
                        onboard_allowance_short_manning: crewEditData.onboard_allowance_short_manning ? parseFloat(crewEditData.onboard_allowance_short_manning) : null
                      }
                    : member
            );
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);

            setIsEditingCrewDetails(false);
        } catch (error) {
            alert((error as Error).message || 'Error updating crew details');
        } finally {
            setIsCrewDetailsSaving(false);
        }
    };

    const getCrewStatus = (member: CrewMember): { status: string; color: string } => {
        const status = member.crew_status || 'NEW';
        
        switch (status) {
            case 'NEW':
                return { status: 'New', color: 'bg-blue-100 text-blue-800' };
            case 'ACTIVE':
                return { status: 'Active', color: 'bg-green-100 text-green-800' };
            case 'COMPLETED':
                return { status: 'Completed', color: 'bg-purple-100 text-purple-800' };
            case 'IN_ACTIVE':
                return { status: 'In-Active', color: 'bg-gray-100 text-gray-800' };
            default:
                return { status: 'New', color: 'bg-blue-100 text-blue-800' };
        }
    };

    const applyFilters = () => {
        let filtered = crew;

        // Search filter (by name or passport)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                member =>
                    member.name.toLowerCase().includes(query) ||
                    (member.passport_number?.toLowerCase().includes(query) || false)
            );
        }

        // Vessel filter
        if (vesselFilter) {
            filtered = filtered.filter(member => member.vessel_id.toString() === vesselFilter);
        }

        // Status filter
        if (statusFilter !== 'All') {
            filtered = filtered.filter(member => member.crew_status === statusFilter);
        }

        // Start date filter (sign_on_date)
        if (startDate) {
            filtered = filtered.filter(member => {
                if (!member.sign_on_date) return false;
                const memberDate = new Date(member.sign_on_date);
                const filterDate = new Date(startDate);
                return memberDate >= filterDate;
            });
        }

        // End date filter (sign_on_date)
        if (endDate) {
            filtered = filtered.filter(member => {
                if (!member.sign_on_date) return false;
                const memberDate = new Date(member.sign_on_date);
                const filterDate = new Date(endDate);
                return memberDate <= filterDate;
            });
        }

        setFilteredCrew(filtered);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setStatusFilter('All');
        setVesselFilter('');
        setSortBy(null);
        setSortOrder('asc');
        setFilteredCrew(crew);
    };

    const handleSort = (column: 'name' | 'passport_number' | 'rank') => {
        // If clicking the same column, toggle order; otherwise set new column with asc order
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortedCrew = () => {
        if (!sortBy) return filteredCrew;

        const sorted = [...filteredCrew].sort((a, b) => {
            let aValue: string;
            let bValue: string;

            if (sortBy === 'name') {
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
            } else if (sortBy === 'passport_number') {
                aValue = (a.passport_number || '').toLowerCase();
                bValue = (b.passport_number || '').toLowerCase();
            } else if (sortBy === 'rank') {
                aValue = (a.rank || '').toLowerCase();
                bValue = (b.rank || '').toLowerCase();
            } else {
                return 0;
            }

            if (sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

        return sorted;
    };

    const exportToExcel = () => {
        const dataToExport = getSortedCrew();
        
        if (dataToExport.length === 0) {
            alert('No crew members to export');
            return;
        }

        const exportData = dataToExport.map((member) => ({
            'Vessel': member.vessels?.vessel_name || '-',
            'Passport No': member.passport_number || '-',
            'Name': member.name,
            'Rank': member.rank || '-',
            'Nationality': member.nationality || '-',
            'DOB': member.date_of_birth ? formatDateDDMMYYYY(member.date_of_birth) : '-',
            'Sign On Date': member.sign_on_date ? formatDateDDMMYYYY(member.sign_on_date) : '-',
            'Sign On Port': member.sign_on_port || '-',
            'Sign Off Date': member.sign_off_date ? formatDateDDMMYYYY(member.sign_off_date) : '-',
            'Sign Off Port': member.sign_off_port || '-',
            'Status': getCrewStatus(member).status,
            'Basic Salary': member.basic_salary || '-',
            'Fixed Overtime': member.fixed_overtime || '-',
            'Leave Wages': member.leave_wages || '-',
            'Other Allowances': member.other_allowances || '-',
            'Travel Wages': member.travel_wages || '-',
            'HRA': member.hra || '-',
            'Joining Expenses': member.joining_expenses || '-',
            'Onboard Allowance': member.onboard_allowance_short_manning || '-',
            'Total Earnings': member.total_earnings || '-'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Crew Members');
        
        // Set column widths
        worksheet['!cols'] = [
            { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
            { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
            { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
            { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
        ];

        XLSX.writeFile(workbook, `Crew_Members_${new Date().getTime()}.xlsx`);
    };

    const openCrewDetails = (member: CrewMember) => {
        setSelectedCrew(member);
        // Initialize edited salary with current values
        setEditedSalary({
            basic_salary: member.basic_salary?.toString() || '',
            fixed_overtime: member.fixed_overtime?.toString() || '',
            leave_wages: member.leave_wages?.toString() || '',
            other_allowances: member.other_allowances?.toString() || '',
            travel_wages: member.travel_wages?.toString() || '',
            hra: member.hra?.toString() || '',
            joining_expenses: member.joining_expenses?.toString() || '',
            onboard_allowance_short_manning: member.onboard_allowance_short_manning?.toString() || '',
        });
    };

    const calculateEditedTotalEarnings = () => {
        if (!editedSalary) return 0;
        const fields = ['basic_salary', 'fixed_overtime', 'leave_wages', 'other_allowances', 'travel_wages', 'hra', 'joining_expenses', 'onboard_allowance_short_manning'];
        return fields.reduce((sum, field) => {
            const value = parseFloat(editedSalary[field as keyof typeof editedSalary]) || 0;
            return sum + value;
        }, 0);
    };

    const handleSalaryChange = (field: string, value: string) => {
        if (!editedSalary) return;
        setEditedSalary({
            ...editedSalary,
            [field]: value
        });
    };

    const saveSalaryChanges = async () => {
        if (!selectedCrew || !editedSalary || !selectedVessel) return;

        try {
            const response = await fetch(`/api/crew/${selectedCrew.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    basic_salary: editedSalary.basic_salary ? parseFloat(editedSalary.basic_salary) : null,
                    fixed_overtime: editedSalary.fixed_overtime ? parseFloat(editedSalary.fixed_overtime) : null,
                    leave_wages: editedSalary.leave_wages ? parseFloat(editedSalary.leave_wages) : null,
                    other_allowances: editedSalary.other_allowances ? parseFloat(editedSalary.other_allowances) : null,
                    travel_wages: editedSalary.travel_wages ? parseFloat(editedSalary.travel_wages) : null,
                    hra: editedSalary.hra ? parseFloat(editedSalary.hra) : null,
                    joining_expenses: editedSalary.joining_expenses ? parseFloat(editedSalary.joining_expenses) : null,
                    onboard_allowance_short_manning: editedSalary.onboard_allowance_short_manning ? parseFloat(editedSalary.onboard_allowance_short_manning) : null,
                    total_earnings: calculateEditedTotalEarnings(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save salary details');
            }

            alert('Salary details updated successfully!');
            
            // Update local state
            const updatedCrew = crew.map(member =>
                member.id === selectedCrew.id
                    ? {
                          ...member,
                          basic_salary: parseFloat(editedSalary.basic_salary) || null,
                          fixed_overtime: parseFloat(editedSalary.fixed_overtime) || null,
                          leave_wages: parseFloat(editedSalary.leave_wages) || null,
                          other_allowances: parseFloat(editedSalary.other_allowances) || null,
                          travel_wages: parseFloat(editedSalary.travel_wages) || null,
                          hra: parseFloat(editedSalary.hra) || null,
                          joining_expenses: parseFloat(editedSalary.joining_expenses) || null,
                          onboard_allowance_short_manning: parseFloat(editedSalary.onboard_allowance_short_manning) || null,
                          total_earnings: calculateEditedTotalEarnings(),
                      }
                    : member
            );
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);
            setSelectedCrew(updatedCrew.find(m => m.id === selectedCrew.id) || null);
        } catch (error) {
            alert((error as Error).message || 'Error saving salary details');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3 text-blue-600">👥</span>
                    Crew Management
                </h1>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${
                            activeTab === 'add'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        ➕ Add New Crew Member
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${
                            activeTab === 'list'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        👁️ View Crew List
                    </button>
                </div>
            </div>

            {/* Add Crew Form Tab */}
            {activeTab === 'add' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Add New Crew Member</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PERSONAL INFO SECTION */}
                    <div className="border-b pb-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Personal Info</h4>
                        
                        {/* Row 1: Passport No, Name, Nationality, Date of Birth */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Passport No *</label>
                                <input
                                    type="text"
                                    name="passport_number"
                                    required
                                    value={formData.passport_number}
                                    onChange={handleChange}
                                    placeholder="Passport Number"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    placeholder="Nationality"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <div>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {formData.date_of_birth && (
                                        (() => {
                                            const { valid: isValidAge, age } = isAtLeast18YearsOld(formData.date_of_birth);
                                            return (
                                                <p className={`mt-1 text-xs font-medium ${isValidAge ? 'text-green-600' : 'text-red-600'}`}>
                                                    {isValidAge ? (
                                                        <>✓ Age: {age} years (Valid)</>
                                                    ) : (
                                                        <>✗ Age: {age} years (Must be 18+)</>
                                                    )}
                                                </p>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Rank, Position, Contact Number, Vessel */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rank</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search rank by name or code..."
                                        value={formData.rank === '' ? rankSearchQuery : (rankSearchQuery || formData.rank)}
                                        onChange={(e) => {
                                            setRankSearchQuery(e.target.value);
                                            setShowRankDropdown(true);
                                        }}
                                        onFocus={() => setShowRankDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowRankDropdown(false), 200)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {showRankDropdown && getFilteredRanks().length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                            {getFilteredRanks().map(rank => (
                                                <button
                                                    key={rank.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            rank: rank.rank_name
                                                        }));
                                                        setRankSearchQuery('');
                                                        setShowRankDropdown(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm transition-colors"
                                                >
                                                    <div className="font-medium">{rank.rank_code} | {rank.rank_name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {formData.rank && (
                                        <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                                            Selected: <strong>{formData.rank}</strong>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        rank: ''
                                                    }));
                                                    setRankSearchQuery('');
                                                }}
                                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-semibold"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="Job Title/Position"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <div>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleChange}
                                        placeholder="e.g., +91 9876543210 or 9876543210"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Only digits and '+' symbol allowed (e.g., +919876543210)</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vessel *</label>
                                {selectedVessel ? (
                                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-blue-50 text-gray-900 text-sm font-medium flex items-center justify-between">
                                        <span>{selectedVessel.vessel_name}</span>
                                        <span className="text-xs text-blue-600 font-semibold">Auto-selected</span>
                                    </div>
                                ) : (
                                    <select
                                        name="vessel_id"
                                        required
                                        value={formData.vessel_id}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Select Vessel</option>
                                        {vessels.map(v => (
                                            <option key={v.id} value={v.id}>{v.vessel_name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Row 3: Sign On Date, Sign On Port, Contract Duration, Tentative Sign Off Date */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sign On Date</label>
                                <div>
                                    <input
                                        type="date"
                                        name="sign_on_date"
                                        value={formData.sign_on_date}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            formData.sign_on_date 
                                                ? isValidSignOnDate(formData.sign_on_date).valid 
                                                    ? 'border-green-300' 
                                                    : 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {formData.sign_on_date && (
                                        (() => {
                                            const { valid, message } = isValidSignOnDate(formData.sign_on_date);
                                            return (
                                                <p className={`mt-1 text-xs font-medium ${valid ? 'text-green-600' : 'text-red-600'}`}>
                                                    {valid ? '✓ Valid date' : `✗ ${message}`}
                                                </p>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sign On Port</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search port..."
                                        value={formData.sign_on_port === '' ? portSearchQuery : (portSearchQuery || formData.sign_on_port)}
                                        onChange={(e) => {
                                            setPortSearchQuery(e.target.value);
                                            setShowPortDropdown(true);
                                        }}
                                        onFocus={() => setShowPortDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowPortDropdown(false), 200)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {showPortDropdown && getFilteredPorts().length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                            {getFilteredPorts().map(port => (
                                                <button
                                                    key={port.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            sign_on_port: port.name
                                                        }));
                                                        setPortSearchQuery('');
                                                        setShowPortDropdown(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm transition-colors"
                                                >
                                                    <div className="font-medium">{port.name}</div>
                                                    {port.code && <div className="text-xs text-gray-500">{port.code}</div>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {formData.sign_on_port && (
                                        <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                                            Selected: <strong>{formData.sign_on_port}</strong>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        sign_on_port: ''
                                                    }));
                                                    setPortSearchQuery('');
                                                }}
                                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-semibold"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contract Duration (Months) *</label>
                                <input
                                    type="number"
                                    name="contract_duration_months"
                                    value={formData.contract_duration_months}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="e.g., 12"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tentative Sign Off Date</label>
                                <input
                                    type="date"
                                    name="tentative_sign_off_date"
                                    value={formData.tentative_sign_off_date}
                                    readOnly
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SALARY SECTION */}
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Salary</h4>
                        
                        {/* Row 1: Basic, Fixed OT, Leave Wages, Other Allowances, Total Earnings */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Basic</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="basic_salary"
                                        value={formData.basic_salary}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fixed OT</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="fixed_overtime"
                                        value={formData.fixed_overtime}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Leave Wages</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="leave_wages"
                                        value={formData.leave_wages}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Other Allowances</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="other_allowances"
                                        value={formData.other_allowances}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Earnings (Auto)</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="total_earnings"
                                        value={formData.total_earnings}
                                        readOnly
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Travel Wages (Display), HRA (Display), Joining Exp, Onboard Allowance */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Travel Wages</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="travel_wages"
                                        value={formData.travel_wages}
                                        readOnly
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">HRA</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="hra"
                                        value={formData.hra}
                                        readOnly
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Joining Exp</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="joining_expenses"
                                        value={formData.joining_expenses}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Onboard Allowance / Short Manning</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="onboard_allowance_short_manning"
                                        value={formData.onboard_allowance_short_manning}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTRACT SECTION - Next to Salary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-4">Contract Document</h4>
                            <p className="text-sm text-gray-600 mb-4">💡 Tip: Upload a contract image to auto-fill Full Name, Date of Birth, Nationality, and all salary fields using OCR</p>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Contract Copy</label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleContractUpload}
                                    disabled={ocrProcessing}
                                    className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-sm"
                                />
                                {ocrProcessing && (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin h-4 w-4 border border-blue-500 rounded-full border-t-transparent"></div>
                                        <span className="text-sm text-blue-600">Processing...</span>
                                    </div>
                                )}
                                {formData.contract_file && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-green-600">✓ File: {formData.contract_file.name}</p>
                                        {contractFileUrl && (
                                            <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                                                <p className="text-xs font-medium text-gray-700 mb-1">Preview:</p>
                                                <img 
                                                    src={contractFileUrl} 
                                                    alt="Contract" 
                                                    className="max-w-xs max-h-40 rounded border border-gray-300 mb-1"
                                                />
                                                <a 
                                                    href={contractFileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:text-blue-800 underline block"
                                                >
                                                    View Full Image →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="border-t pt-6 flex gap-2">
                        <button
                            type="submit"
                            disabled={isSubmitLoading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium text-sm disabled:opacity-50 transition-colors"
                        >
                            {isSubmitLoading ? 'Adding...' : 'Add Crew Member'}
                        </button>
                    </div>
                </form>
            </div>
            )}

            {/* Crew List Tab */}
            {activeTab === 'list' && (
            <div className="space-y-6">
                {/* Filter Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Crew Filters</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Name or Passport No..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Vessel Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vessel</label>
                            <div className="relative">
                                <select
                                    value={vesselFilter}
                                    onChange={(e) => setVesselFilter(e.target.value)}
                                    disabled={!!selectedVessel}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-700"
                                >
                                    <option value="">All Vessels</option>
                                    {vessels.map(vessel => (
                                        <option key={vessel.id} value={vessel.id.toString()}>{vessel.vessel_name}</option>
                                    ))}
                                </select>
                                {selectedVessel && (
                                    <span className="absolute right-10 top-2 text-xs text-blue-600 font-semibold">Auto-filtered</span>
                                )}
                            </div>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (DD/MM/YYYY)</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (DD/MM/YYYY)</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="All">All</option>
                                <option value="NEW">New</option>
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="IN_ACTIVE">In-Active</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium text-sm transition-colors"
                        >
                            Clear Filters
                        </button>
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors"
                        >
                            📥 Download Excel
                        </button>
                        <span className="ml-auto text-sm text-gray-600 py-2">
                            Showing {filteredCrew.length} of {crew.length} crew member(s)
                        </span>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel</th>
                                <th 
                                    onClick={() => handleSort('passport_number')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    Passport No {sortBy === 'passport_number' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th 
                                    onClick={() => handleSort('name')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th 
                                    onClick={() => handleSort('rank')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign On Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign Off Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
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
                            ) : filteredCrew.length === 0 ? (
                                <tr>
                                    <td colSpan={userRole === 'ADMIN' ? 9 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No crew records found.
                                    </td>
                                </tr>
                            ) : (
                                getSortedCrew().map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {member.vessels?.vessel_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedCrew(member)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                            >
                                                {member.passport_number || '-'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.rank || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.sign_on_date ? formatDateDDMMYYYY(member.sign_on_date) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.sign_off_date ? (
                                                <div className="flex items-center gap-2">
                                                    <span>{formatDateDDMMYYYY(member.sign_off_date)}</span>
                                                    {member.exit_type && (
                                                        <span
                                                            title={member.exit_type === 'SUCCESSFUL' ? 'Successful Exit' : 'Break Contract'}
                                                            className={member.exit_type === 'SUCCESSFUL' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}
                                                        >
                                                            {member.exit_type === 'SUCCESSFUL' ? '✓' : '✗'}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            {member.contract_file ? (
                                                <a
                                                    href={member.contract_file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Download contract"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                >
                                                    📄 View
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(() => {
                                                const { status, color } = getCrewStatus(member);
                                                return (
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
                                                        {status}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        {userRole === 'ADMIN' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {member.crew_status === 'NEW' && (
                                                    <button
                                                        onClick={() => handleApprove(member.id)}
                                                        disabled={approvingId === member.id}
                                                        className="text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-3 py-1 rounded-md transition-colors disabled:cursor-not-allowed"
                                                    >
                                                        {approvingId === member.id ? 'Approving...' : 'Approve'}
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
            )}

            {/* Crew Details Modal */}
            {selectedCrew && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Crew Member Details</h2>
                            <button
                                onClick={() => setSelectedCrew(null)}
                                className="text-white hover:text-gray-200 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Personal Info Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                    {!isEditingCrewDetails && selectedCrew.crew_status === 'NEW' && userRole === 'ADMIN' && (
                                        <button
                                            onClick={handleEditCrewDetails}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium transition-colors"
                                        >
                                            Edit Details
                                        </button>
                                    )}
                                </div>
                                {isEditingCrewDetails ? (
                                    <div className="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                                                <input
                                                    type="text"
                                                    value={crewEditData.passport_number}
                                                    onChange={(e) => setCrewEditData({...crewEditData, passport_number: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                                <input
                                                    type="text"
                                                    value={crewEditData.name}
                                                    onChange={(e) => setCrewEditData({...crewEditData, name: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                                                <input
                                                    type="text"
                                                    value={crewEditData.rank}
                                                    onChange={(e) => setCrewEditData({...crewEditData, rank: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                                <input
                                                    type="text"
                                                    value={crewEditData.nationality}
                                                    onChange={(e) => setCrewEditData({...crewEditData, nationality: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={crewEditData.date_of_birth}
                                                    onChange={(e) => setCrewEditData({...crewEditData, date_of_birth: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sign On Port</label>
                                                <input
                                                    type="text"
                                                    value={crewEditData.sign_on_port}
                                                    onChange={(e) => setCrewEditData({...crewEditData, sign_on_port: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sign On Date</label>
                                                <input
                                                    type="date"
                                                    value={crewEditData.sign_on_date}
                                                    onChange={(e) => setCrewEditData({...crewEditData, sign_on_date: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                            <button
                                                onClick={handleSaveCrewDetails}
                                                disabled={isCrewDetailsSaving}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 font-medium text-sm transition-colors disabled:cursor-not-allowed"
                                            >
                                                {isCrewDetailsSaving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={handleCancelEditCrewDetails}
                                                disabled={isCrewDetailsSaving}
                                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300 font-medium text-sm transition-colors disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Passport Number</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.passport_number || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Name</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Rank</p>
                                            <p className="text-base text-gray-900">{selectedCrew.rank || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Nationality</p>
                                            <p className="text-base text-gray-900">{selectedCrew.nationality || '-'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contract File Section */}
                            {selectedCrew.contract_file && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contract Document</h3>
                                    <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">📄</div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Contract File</p>
                                                    <p className="text-base text-gray-900 font-semibold break-all">
                                                        {selectedCrew.contract_file.split('/').pop()}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={selectedCrew.contract_file}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors whitespace-nowrap"
                                            >
                                                📥 Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sign On/Off Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Employment Period</h3>
                                    {!isEditingExit && selectedCrew.crew_status !== 'COMPLETED' && selectedCrew.onboarding_status === 'APPROVED' && (
                                        <button
                                            onClick={handleEditExit}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium transition-colors"
                                        >
                                            Edit Exit Details
                                        </button>
                                    )}
                                    {selectedCrew.crew_status === 'COMPLETED' && (
                                        <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md font-medium">Exit Locked</span>
                                    )}
                                </div>
                                {isEditingExit ? (
                                    <div className="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Sign On Date</p>
                                                <p className="text-base text-gray-900">{selectedCrew.sign_on_date ? formatDateDDMMYYYY(selectedCrew.sign_on_date) : '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Sign On Port</p>
                                                <p className="text-base text-gray-900">{selectedCrew.sign_on_port || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 border-t border-blue-300 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exit Date *</label>
                                                    <input
                                                        type="date"
                                                        value={exitEditData.sign_off_date}
                                                        onChange={(e) => setExitEditData({...exitEditData, sign_off_date: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exit Port</label>
                                                    <select
                                                        value={exitEditData.sign_off_port}
                                                        onChange={(e) => setExitEditData({...exitEditData, sign_off_port: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Select Port</option>
                                                        {ports.map(port => (
                                                            <option key={port.id} value={port.name}>{port.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exit Type *</label>
                                                    <select
                                                        value={exitEditData.exit_type}
                                                        onChange={(e) => setExitEditData({...exitEditData, exit_type: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Select Exit Type</option>
                                                        <option value="SUCCESSFUL">Successful</option>
                                                        <option value="BREAK_CONTRACT">Break Contract</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {exitEditData.exit_type === 'BREAK_CONTRACT' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Break Contract *</label>
                                                    <textarea
                                                        value={exitEditData.exit_remarks}
                                                        onChange={(e) => setExitEditData({...exitEditData, exit_remarks: e.target.value})}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter reason for contract break..."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                            <button
                                                onClick={handleSaveExit}
                                                disabled={isExitSaving}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 font-medium text-sm transition-colors disabled:cursor-not-allowed"
                                            >
                                                {isExitSaving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={handleCancelEditExit}
                                                disabled={isExitSaving}
                                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300 font-medium text-sm transition-colors disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Sign On Date</p>
                                            <p className="text-base text-gray-900">{selectedCrew.sign_on_date ? formatDateDDMMYYYY(selectedCrew.sign_on_date) : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Sign On Port</p>
                                            <p className="text-base text-gray-900">{selectedCrew.sign_on_port || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Exit Date</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.sign_off_date ? formatDateDDMMYYYY(selectedCrew.sign_off_date) : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Exit Port</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.sign_off_port || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Exit Type</p>
                                            <p className="text-base text-gray-900 font-semibold">
                                                {selectedCrew.exit_type === 'SUCCESSFUL' ? 'Successful' : 
                                                 selectedCrew.exit_type === 'BREAK_CONTRACT' ? 'Break Contract' : '-'}
                                            </p>
                                        </div>
                                        {selectedCrew.exit_type === 'BREAK_CONTRACT' && selectedCrew.exit_remarks && (
                                            <div className="md:col-span-2">
                                                <p className="text-sm font-medium text-gray-600">Break Contract Reason</p>
                                                <p className="text-base text-gray-900">{selectedCrew.exit_remarks}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Salary Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Salary Details</h3>
                                {isEditingCrewDetails ? (
                                    <div className="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                                    <input
                                                        type="number"
                                                        value={crewEditData.basic_salary}
                                                        onChange={(e) => setCrewEditData({...crewEditData, basic_salary: e.target.value})}
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Overtime</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                                    <input
                                                        type="number"
                                                        value={crewEditData.fixed_overtime}
                                                        onChange={(e) => setCrewEditData({...crewEditData, fixed_overtime: e.target.value})}
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Wages</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                                    <input
                                                        type="number"
                                                        value={crewEditData.leave_wages}
                                                        onChange={(e) => setCrewEditData({...crewEditData, leave_wages: e.target.value})}
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Other Allowances</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                                    <input
                                                        type="number"
                                                        value={crewEditData.other_allowances}
                                                        onChange={(e) => setCrewEditData({...crewEditData, other_allowances: e.target.value})}
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Expenses</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                                    <input
                                                        type="number"
                                                        value={crewEditData.joining_expenses}
                                                        onChange={(e) => setCrewEditData({...crewEditData, joining_expenses: e.target.value})}
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Onboard Allowance / Short Manning</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-600 font-medium">$</span>
                                                    <input
                                                        type="number"
                                                        value={crewEditData.onboard_allowance_short_manning}
                                                        onChange={(e) => setCrewEditData({...crewEditData, onboard_allowance_short_manning: e.target.value})}
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm font-medium text-gray-600">Basic Salary</p>
                                                <p className="text-base text-gray-900 font-semibold">${selectedCrew.basic_salary ? `${parseFloat(String(selectedCrew.basic_salary)).toFixed(2)}` : '-'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm font-medium text-gray-600">Fixed Overtime</p>
                                                <p className="text-base text-gray-900 font-semibold">${selectedCrew.fixed_overtime ? `${parseFloat(String(selectedCrew.fixed_overtime)).toFixed(2)}` : '-'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm font-medium text-gray-600">Leave Wages</p>
                                                <p className="text-base text-gray-900 font-semibold">${selectedCrew.leave_wages ? `${parseFloat(String(selectedCrew.leave_wages)).toFixed(2)}` : '-'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm font-medium text-gray-600">Other Allowances</p>
                                                <p className="text-base text-gray-900 font-semibold">${selectedCrew.other_allowances ? `${parseFloat(String(selectedCrew.other_allowances)).toFixed(2)}` : '-'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm font-medium text-gray-600">Joining Expenses</p>
                                                <p className="text-base text-gray-900 font-semibold">${selectedCrew.joining_expenses ? `${parseFloat(String(selectedCrew.joining_expenses)).toFixed(2)}` : '-'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm font-medium text-gray-600">Onboard Allowance / Short Manning</p>
                                                <p className="text-base text-gray-900 font-semibold">${selectedCrew.onboard_allowance_short_manning ? `${parseFloat(String(selectedCrew.onboard_allowance_short_manning)).toFixed(2)}` : '-'}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-md border border-blue-200 mt-4">
                                            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                            <p className="text-lg text-blue-600 font-bold">${selectedCrew.total_earnings ? `${parseFloat(String(selectedCrew.total_earnings)).toFixed(2)}` : '-'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Crew Status</h3>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Current Status</p>
                                    {(() => {
                                        const { status, color } = getCrewStatus(selectedCrew);
                                        return (
                                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${color}`}>
                                                {status}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <div className="mt-4 text-xs text-gray-500 space-y-1">
                                    <p>• <strong>New:</strong> Crew member added, pending approval</p>
                                    <p>• <strong>Active:</strong> Approved and currently on vessel</p>
                                    <p>• <strong>Completed:</strong> Exit date has been set</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedCrew(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium text-sm transition-colors"
                            >
                                Close
                            </button>
                            {selectedCrew.crew_status === 'NEW' && userRole === 'ADMIN' && (
                                <button
                                    onClick={() => handleApprove(selectedCrew.id)}
                                    disabled={approvingId === selectedCrew.id}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 font-medium text-sm transition-colors disabled:cursor-not-allowed"
                                >
                                    {approvingId === selectedCrew.id ? 'Approving...' : 'Approve Crew Member'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
