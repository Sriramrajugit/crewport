'use client';

import { useState, useEffect } from 'react';
import { useVessel } from '@/app/context/VesselContext';
import VesselMasterTab from '@/components/vessel/VesselMasterTab';
import VesselOwnershipTab from '@/components/vessel/VesselOwnershipTab';
import VesselCommercialTab from '@/components/vessel/VesselCommercialTab';
import VesselTechnicalTab from '@/components/vessel/VesselTechnicalTab';
import VesselEngineTab from '@/components/vessel/VesselEngineTab';
import VesselPropulsionTab from '@/components/vessel/VesselPropulsionTab';
import VesselTanksTab from '@/components/vessel/VesselTanksTab';
import VesselCertificatesTab from '@/components/vessel/VesselCertificatesTab';
import VesselCrewConfigTab from '@/components/vessel/VesselCrewConfigTab';
import VesselNavigationTab from '@/components/vessel/VesselNavigationTab';
import VesselEnvironmentTab from '@/components/vessel/VesselEnvironmentTab';
import VesselMaintenanceTab from '@/components/vessel/VesselMaintenanceTab';

type TabType = 'master' | 'ownership' | 'commercial' | 'technical' | 'certificates' | 'navigation-environment' | 'maintenance';

interface VesselData {
  id: number;
  vessel_name: string;
  imo_number?: string;
  [key: string]: any;
}

export default function VesselManagement() {
  const { selectedVessel } = useVessel();
  const [activeTab, setActiveTab] = useState<TabType>('master');
  const [vesselData, setVesselData] = useState<VesselData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedVessel) {
      fetchVesselData();
    }
  }, [selectedVessel]);

  const fetchVesselData = async () => {
    if (!selectedVessel) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/vessels/${selectedVessel.vessel_id}`);
      
      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        console.error('API Error:', {
          status: response.status,
          message: errorMsg,
          vesselId: selectedVessel.vessel_id
        });
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      setVesselData(data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Error fetching vessel data:', errorMsg);
      // Show error alert to user
      const userMessage = errorMsg.includes('Unauthorized')
        ? 'Your session has expired. Please log in again.'
        : `Failed to load vessel data: ${errorMsg}`;
      alert(userMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedVessel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 text-lg">Please select a vessel from the dashboard menu</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'master', label: '⚓ Master & General', icon: '🚢' },
    { id: 'ownership', label: '🏢 Ownership & Crew', icon: '👥' },
    { id: 'commercial', label: '💼 Commercial', icon: '📊' },
    { id: 'technical', label: '📐 Technical Details', icon: '⚙️' },
    { id: 'certificates', label: '📜 Certificates', icon: '🎖️' },
    { id: 'navigation-environment', label: '🌍 Navigation & Environment', icon: '📡' },
    { id: 'maintenance', label: '🔧 Maintenance', icon: '⚒️' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3 text-blue-600">⚓</span>
            Vessel Management
          </h1>
          <p className="text-gray-600 mt-2">{selectedVessel.vessel_name}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Loading vessel data...</p>
          </div>
        ) : vesselData ? (
          <>
            {/* Master & General */}
            {activeTab === 'master' && (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <VesselMasterTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                </div>
              </>
            )}

            {/* Ownership & Crew Config */}
            {activeTab === 'ownership' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <VesselOwnershipTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <VesselCrewConfigTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                </div>
              </div>
            )}

            {/* Commercial */}
            {activeTab === 'commercial' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <VesselCommercialTab vessel={vesselData} onDataUpdate={fetchVesselData} />
              </div>
            )}

            {/* Technical Details (3 sections) */}
            {activeTab === 'technical' && (
              <div className="space-y-4">
                {/* Technical Specs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <VesselTechnicalTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                </div>
                
                {/* Engine, Propulsion, Tanks in grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
                    <VesselEngineTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
                    <VesselPropulsionTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
                    <VesselTanksTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                  </div>
                </div>
              </div>
            )}

            {/* Certificates */}
            {activeTab === 'certificates' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <VesselCertificatesTab vessel={vesselData} onDataUpdate={fetchVesselData} />
              </div>
            )}

            {/* Navigation & Environment */}
            {activeTab === 'navigation-environment' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <VesselNavigationTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <VesselEnvironmentTab vessel={vesselData} onDataUpdate={fetchVesselData} />
                </div>
              </div>
            )}

            {/* Maintenance */}
            {activeTab === 'maintenance' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <VesselMaintenanceTab vessel={vesselData} onDataUpdate={fetchVesselData} />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No vessel data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
