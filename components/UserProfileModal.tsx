'use client';

import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company: any;
}

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
    if (!isOpen || !user) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-96 max-w-full mx-4">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="text-2xl">✕</span>
                        </button>
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                            {user.name?.substring(0, 1) || user.email?.substring(0, 1)}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                            <p className="text-sm text-gray-900 font-medium">{user.name}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                            <p className="text-sm text-gray-900">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Role</label>
                            <p className="text-sm text-gray-900 font-medium">
                                {user.role === 'ADMIN' ? 'Administrator' : 'Vessel User'}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                {user.role}
                            </span>
                        </div>

                        {user.company && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company</label>
                                <p className="text-sm text-gray-900">{user.company.company_name || 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
