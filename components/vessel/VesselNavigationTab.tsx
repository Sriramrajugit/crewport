'use client';
import GenericVesselTab from './GenericVesselTab';

export default function VesselNavigationTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'ais_type', label: 'AIS Type', type: 'text' as const },
    { name: 'radar_type', label: 'Radar Type', type: 'text' as const },
    { name: 'ecdis_model', label: 'ECDIS Model', type: 'text' as const },
    { name: 'gps_system', label: 'GPS System', type: 'text' as const },
    { name: 'satcom', label: 'Satcom System', type: 'text' as const },
    { name: 'vdr', label: 'VDR Equipped', type: 'checkbox' as const },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="navigation"
      title="Navigation Systems"
      fields={fields}
    />
  );
}
