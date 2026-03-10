'use client';

import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    user_vessels: Array<{ vessel_id: number; role_on_vessel: string }>;
}

interface Vessel {
    id: number;
    vessel_name: string;
    company_id: number;
    companies: { company_name: string };
}

interface Company {
    id: number;
    company_name: string;
}

interface Roles {
    id: number;
    role_name: string;
}

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
    const [users, setUsers] = useState<User[]>([]);
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [roles, setRoles] = useState<Roles[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: 2, // Default to VESSEL_USER
        is_active: true,
        selected_vessels: [] as number[]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, vesselsRes, companiesRes, rolesRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/masters/vessels'),
                fetch('/api/masters/companies'),
                fetch('/api/masters/roles')
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (vesselsRes.ok) setVessels(await vesselsRes.json());
            if (companiesRes.ok) setCompanies(await companiesRes.json());
            if (rolesRes.ok) setRoles(await rolesRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setSelectedUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role_id: 2,
            is_active: true,
            selected_vessels: []
        });
        setActiveTab('create');
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        const role = roles.find(r => r.role_name === user.role);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: role?.id || 2,
            is_active: user.is_active,
            selected_vessels: user.user_vessels.map(uv => uv.vessel_id)
        });
        setActiveTab('edit');
    };

    const handleVesselToggle = (vesselId: number) => {
        setFormData(prev => ({
            ...prev,
            selected_vessels: prev.selected_vessels.includes(vesselId)
                ? prev.selected_vessels.filter(v => v !== vesselId)
                : [...prev.selected_vessels, vesselId]
        }));
    };

    const handleSaveUser = async () => {
        if (!formData.name || !formData.email || formData.selected_vessels.length === 0) {
            alert('Please fill all required fields and select at least one vessel');
            return;
        }

        if (!selectedUser && !formData.password) {
            alert('Password is required for new users');
            return;
        }

        try {
            setIsSubmitting(true);
            const url = selectedUser ? `/api/users/${selectedUser.id}` : '/api/users';
            const method = selectedUser ? 'PUT' : 'POST';
            
            const body: any = {
                name: formData.name,
                email: formData.email,
                role_id: formData.role_id,
                is_active: formData.is_active,
                selected_vessels: formData.selected_vessels
            };

            if (formData.password) {
                body.password = formData.password;
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert(selectedUser ? 'User updated successfully' : 'User created successfully');
                await fetchData();
                setActiveTab('list');
            } else {
                const error = await response.json();
                alert('Error: ' + (error.error || 'Failed to save user'));
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('User deleted successfully');
                await fetchData();
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    const groupedVessels = companies.map(company => ({
        company,
        vessels: vessels.filter(v => v.company_id === company.id)
    }));

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">👥</span>
                User Management
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'list'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    User List
                </button>
                <button
                    onClick={handleCreateClick}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'create'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Create User
                </button>
            </div>

            {/* User List Tab */}
            {activeTab === 'list' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">All Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Vessels</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{user.name}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {user.user_vessels.length} vessel(s)
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                user.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit User Tab */}
            {(activeTab === 'create' || activeTab === 'edit') && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-6">
                        {selectedUser ? 'Edit User' : 'Create New User'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">User Details</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User Role *
                                </label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                                >
                                    <option value="">Select a role...</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.role_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {!selectedUser && '*'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                                    placeholder={selectedUser ? 'Leave blank to keep current password' : 'Enter password'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.is_active ? 'active' : 'inactive'}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Vessel Assignment */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Assign Vessels *</h3>
                            <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
                                {groupedVessels.map(({ company, vessels: companyVessels }) => (
                                    <div key={company.id} className="mb-4">
                                        <h4 className="font-medium text-gray-800 mb-2">{company.company_name}</h4>
                                        <div className="ml-4 space-y-2">
                                            {companyVessels.map(vessel => (
                                                <label key={vessel.id} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.selected_vessels.includes(vessel.id)}
                                                        onChange={() => handleVesselToggle(vessel.id)}
                                                        className="rounded border-gray-300 mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">{vessel.vessel_name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">
                                Selected: {formData.selected_vessels.length} vessel(s)
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleSaveUser}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:bg-blue-400"
                        >
                            {isSubmitting ? 'Saving...' : 'Save User'}
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
