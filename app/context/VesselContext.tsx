'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AssignedVessel {
    vessel_id: number;
    vessel_name: string;
    company_name: string;
    role_on_vessel: string;
}

interface VesselContextType {
    selectedVessel: AssignedVessel | null;
    setSelectedVessel: (vessel: AssignedVessel | null) => void;
    assignedVessels: AssignedVessel[];
    setAssignedVessels: (vessels: AssignedVessel[]) => void;
    loading: boolean;
    error: string | null;
}

const VesselContext = createContext<VesselContextType | undefined>(undefined);

export function VesselProvider({ children }: { children: React.ReactNode }) {
    const [selectedVessel, setSelectedVessel] = useState<AssignedVessel | null>(null);
    const [assignedVessels, setAssignedVessels] = useState<AssignedVessel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user profile and vessels on mount
    useEffect(() => {
        const loadVessels = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('/api/auth/me');
                
                if (!response.ok) {
                    // If auth fails, set empty vessels (user not logged in yet)
                    console.warn('User profile not available - user may not be authenticated');
                    setAssignedVessels([]);
                    setSelectedVessel(null);
                    setError(null); // Don't show error - this is expected during login
                    return;
                }

                const userData = await response.json();
                setAssignedVessels(userData.assigned_vessels || []);
                
                // Auto-select first vessel if available
                if (userData.assigned_vessels && userData.assigned_vessels.length > 0) {
                    setSelectedVessel(userData.assigned_vessels[0]);
                } else {
                    setSelectedVessel(null);
                    console.warn('User has no assigned vessels');
                }
            } catch (err) {
                // Don't show error to user - this is expected if not authenticated
                const errorMsg = err instanceof Error ? err.message : 'Failed to load vessels';
                console.warn('Error loading vessels (expected if not authenticated):', errorMsg);
                setError(null); // Clear error to not break UI
                setAssignedVessels([]);
                setSelectedVessel(null);
            } finally {
                setLoading(false);
            }
        };

        loadVessels();
    }, []);

    return (
        <VesselContext.Provider
            value={{
                selectedVessel,
                setSelectedVessel,
                assignedVessels,
                setAssignedVessels,
                loading,
                error
            }}
        >
            {children}
        </VesselContext.Provider>
    );
}

export function useVessel() {
    const context = useContext(VesselContext);
    if (context === undefined) {
        throw new Error('useVessel must be used within a VesselProvider');
    }
    return context;
}
