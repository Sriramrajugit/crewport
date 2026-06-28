'use client';

import GenericVesselTab from './GenericVesselTab';

export default function VesselEngineTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'main_engine_maker', label: 'Main Engine Maker', type: 'text' as const },
    { name: 'main_engine_model', label: 'Main Engine Model', type: 'text' as const },
    { name: 'engine_type', label: 'Engine Type', type: 'select' as const, options: [{ label: '2-Stroke', value: '2-stroke' }, { label: '4-Stroke', value: '4-stroke' }] },
    { name: 'mcr_power_kw', label: 'MCR Power (kW)', type: 'number' as const, step: '0.01' },
    { name: 'rpm', label: 'RPM', type: 'number' as const },
    { name: 'fuel_type', label: 'Fuel Type', type: 'text' as const },
    { name: 'no_of_generators', label: 'Number of Generators', type: 'number' as const },
    { name: 'generator_capacity_kw', label: 'Generator Capacity (kW)', type: 'number' as const, step: '0.01' },
    { name: 'emergency_generator', label: 'Emergency Generator', type: 'checkbox' as const },
    { name: 'boiler_type', label: 'Boiler Type', type: 'text' as const },
    { name: 'boiler_capacity', label: 'Boiler Capacity', type: 'number' as const, step: '0.01' },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="engine"
      title="Engine Details"
      fields={fields}
    />
  );
}
