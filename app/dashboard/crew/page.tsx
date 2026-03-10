'use client';

import { useState, useEffect } from 'react';
import { formatDateDDMMYYYY } from '@/lib/formatters';
import { processContractWithOCR } from '@/lib/ocrUtils';
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
    port_name: string;
    port_code: string;
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
    const [isEditingExit, setIsEditingExit] = useState(false);
    const [exitEditData, setExitEditData] = useState({
        sign_off_date: '',
        sign_off_port: '',
        exit_type: '',
        exit_remarks: ''
    });
    const [isExitSaving, setIsExitSaving] = useState(false);
    
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
        sign_off_date: '',
        sign_off_port: '',
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
                setPorts(portsData);
            }
            if (crewRes.ok) {
                const crewData = await crewRes.json();
                setCrew(crewData);
                setFilteredCrew(crewData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newFormData = {
            ...formData,
            [e.target.name]: e.target.value
        };

        // Auto-calculate total earnings if this is a salary field
        const salaryFields = ['basic_salary', 'fixed_overtime', 'leave_wages', 'other_allowances', 'travel_wages', 'hra', 'joining_expenses', 'onboard_allowance_short_manning'];
        if (salaryFields.includes(e.target.name)) {
            newFormData.total_earnings = calculateTotalEarnings(newFormData);
        }

        setFormData(newFormData);
    };

    const handleContractUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

                if (!error && salaryData) {
                    // Auto-fill fields with extracted data
                    const updatedData = {
                        name: salaryData.full_name ? salaryData.full_name : formData.name,
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

                    setFormData(prev => ({
                        ...prev,
                        ...updatedData,
                        total_earnings: calculateTotalEarnings({ ...prev, ...updatedData })
                    }));
                    alert('Contract uploaded successfully! Employee details and salary fields have been auto-filled.');
                }
            } catch (ocrError) {
                // OCR processing failed, but file was uploaded - continue anyway
                console.log('OCR processing skipped, but contract file saved');
                alert('Contract file uploaded successfully. Note: OCR processing will be improved later.');
            }
        } catch (error) {
            alert((error as Error).message || 'Error uploading contract');
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
                vessel_id: '',
                sign_on_date: new Date().toISOString().split('T')[0],
                sign_on_port: '',
                sign_off_date: '',
                sign_off_port: '',
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
            console.error('Error approving crew member:', error);
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
            console.error('Error updating exit details:', error);
            alert((error as Error).message || 'Error updating exit details');
        } finally {
            setIsExitSaving(false);
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
        setFilteredCrew(crew);
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
            console.error('Error saving salary details:', error);
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
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Row 2: Rank, Position, Contact Number, Vessel */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rank</label>
                                <select
                                    name="rank"
                                    value={formData.rank}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Rank</option>
                                    {ranks.map(r => (
                                        <option key={r.id} value={r.rank_name}>{r.rank_name}</option>
                                    ))}
                                </select>
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
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vessel *</label>
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
                            </div>
                        </div>

                        {/* Row 3: Sign On Date, Sign On Port, Sign Off Date, Sign Off Port */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sign On Date</label>
                                <input
                                    type="date"
                                    name="sign_on_date"
                                    value={formData.sign_on_date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sign On Port</label>
                                <select
                                    name="sign_on_port"
                                    value={formData.sign_on_port}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Port</option>
                                    {ports.map(p => (
                                        <option key={p.id} value={p.port_name}>{p.port_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sign Off Date</label>
                                <input
                                    type="date"
                                    name="sign_off_date"
                                    value={formData.sign_off_date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sign Off Port</label>
                                <select
                                    name="sign_off_port"
                                    value={formData.sign_off_port}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Port</option>
                                    {ports.map(p => (
                                        <option key={p.id} value={p.port_name}>{p.port_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>



                    {/* SALARY SECTION */}
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Salary</h4>
                        
                        {/* Row 1: Basic, Fixed OT, Leave Wages, Other Allowances, Travel Wages */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Basic</label>
                                <input
                                    type="number"
                                    name="basic_salary"
                                    value={formData.basic_salary}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fixed OT</label>
                                <input
                                    type="number"
                                    name="fixed_overtime"
                                    value={formData.fixed_overtime}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Leave Wages</label>
                                <input
                                    type="number"
                                    name="leave_wages"
                                    value={formData.leave_wages}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Other Allowances</label>
                                <input
                                    type="number"
                                    name="other_allowances"
                                    value={formData.other_allowances}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Travel Wages</label>
                                <input
                                    type="number"
                                    name="travel_wages"
                                    value={formData.travel_wages}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Row 2: HRA, Joining Exp, Onboard Allowance, Total Earnings */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">HRA</label>
                                <input
                                    type="number"
                                    name="hra"
                                    value={formData.hra}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Joining Exp</label>
                                <input
                                    type="number"
                                    name="joining_expenses"
                                    value={formData.joining_expenses}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Onboard Allowance / Short Manning</label>
                                <input
                                    type="number"
                                    name="onboard_allowance_short_manning"
                                    value={formData.onboard_allowance_short_manning}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Earnings (Auto)</label>
                                <input
                                    type="number"
                                    name="total_earnings"
                                    value={formData.total_earnings}
                                    readOnly
                                    placeholder="0.00"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CONTRACT SECTION - Next to Salary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-4">Contract Document</h4>
                            <p className="text-sm text-gray-600 mb-4">💡 Tip: Upload a contract image to auto-fill Full Name, Nationality, Leave Wages and all salary fields using OCR</p>
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
                            <select
                                value={vesselFilter}
                                onChange={(e) => setVesselFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">All Vessels</option>
                                {vessels.map(vessel => (
                                    <option key={vessel.id} value={vessel.id.toString()}>{vessel.vessel_name}</option>
                                ))}
                            </select>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign On Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign Off Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {userRole === 'ADMIN' && (
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={userRole === 'ADMIN' ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Loading crew data...
                                    </td>
                                </tr>
                            ) : filteredCrew.length === 0 ? (
                                <tr>
                                    <td colSpan={userRole === 'ADMIN' ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No crew records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCrew.map(member => (
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
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
                            </div>

                            {/* Sign On/Off Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Employment Period</h3>
                                    {!isEditingExit && selectedCrew.crew_status !== 'COMPLETED' && (
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
                                                            <option key={port.id} value={port.port_name}>{port.port_name}</option>
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
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">Basic Salary</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.basic_salary ? `${parseFloat(String(selectedCrew.basic_salary)).toFixed(2)}` : '-'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">Fixed Overtime</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.fixed_overtime ? `${parseFloat(String(selectedCrew.fixed_overtime)).toFixed(2)}` : '-'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">Leave Wages</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.leave_wages ? `${parseFloat(String(selectedCrew.leave_wages)).toFixed(2)}` : '-'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">Other Allowances</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.other_allowances ? `${parseFloat(String(selectedCrew.other_allowances)).toFixed(2)}` : '-'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">Travel Wages</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.travel_wages ? `${parseFloat(String(selectedCrew.travel_wages)).toFixed(2)}` : '-'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">HRA</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.hra ? `${parseFloat(String(selectedCrew.hra)).toFixed(2)}` : '-'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">Joining Expenses</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.joining_expenses ? `${parseFloat(String(selectedCrew.joining_expenses)).toFixed(2)}` : '-'}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm font-medium text-gray-600">Onboard Allowance / Short Manning</p>
                                            <p className="text-base text-gray-900 font-semibold">{selectedCrew.onboard_allowance_short_manning ? `${parseFloat(String(selectedCrew.onboard_allowance_short_manning)).toFixed(2)}` : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-md border border-blue-200 mt-4">
                                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                        <p className="text-lg text-blue-600 font-bold">{selectedCrew.total_earnings ? `${parseFloat(String(selectedCrew.total_earnings)).toFixed(2)}` : '-'}</p>
                                    </div>
                                </div>
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
