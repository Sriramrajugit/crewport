'use client';
import GenericVesselTab from './GenericVesselTab';

export default function VesselMaintenanceTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'pms_system_id', label: 'PMS System ID', type: 'text' as const },
    { name: 'last_dry_dock', label: 'Last Dry Dock Date', type: 'date' as const },
    { name: 'next_dry_dock', label: 'Next Dry Dock Date', type: 'date' as const },
    { name: 'last_survey', label: 'Last Survey Date', type: 'date' as const },
    { name: 'next_survey', label: 'Next Survey Date', type: 'date' as const },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="maintenance"
      title="Maintenance & Surveys"
      fields={fields}
    />
  );
}
