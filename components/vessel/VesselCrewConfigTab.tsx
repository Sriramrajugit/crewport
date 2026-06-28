'use client';
import GenericVesselTab from './GenericVesselTab';

export default function VesselCrewConfigTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'manning_agent', label: 'Manning Agent', type: 'text' as const },
    { name: 'crew_capacity', label: 'Total Crew Capacity', type: 'number' as const },
    { name: 'officer_count', label: 'Officer Count', type: 'number' as const },
    { name: 'rating_count', label: 'Rating Count', type: 'number' as const },
    { name: 'nationality_mix', label: 'Nationality Mix', type: 'text' as const },
    { name: 'union_type', label: 'Union Type', type: 'text' as const },
    { name: 'payroll_type', label: 'Payroll Type', type: 'text' as const },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="crew-config"
      title="Crew Configuration"
      fields={fields}
    />
  );
}
