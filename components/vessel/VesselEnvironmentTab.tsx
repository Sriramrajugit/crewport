'use client';
import GenericVesselTab from './GenericVesselTab';

export default function VesselEnvironmentTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'bwts', label: 'Ballast Water Treatment System', type: 'checkbox' as const },
    { name: 'scrubber', label: 'Scrubber Installed', type: 'checkbox' as const },
    { name: 'eexi_rating', label: 'EEXI Rating', type: 'text' as const },
    { name: 'cii_rating', label: 'CII Rating', type: 'text' as const },
    { name: 'emission_tier', label: 'Emission Tier', type: 'text' as const },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="environment"
      title="Environmental Compliance"
      fields={fields}
    />
  );
}
