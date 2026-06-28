'use client';
import GenericVesselTab from './GenericVesselTab';

export default function VesselPropulsionTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'propeller_type', label: 'Propeller Type', type: 'text' as const },
    { name: 'no_of_propellers', label: 'Number of Propellers', type: 'number' as const },
    { name: 'bow_thruster_kw', label: 'Bow Thruster (kW)', type: 'number' as const, step: '0.01' },
    { name: 'stern_thruster_kw', label: 'Stern Thruster (kW)', type: 'number' as const, step: '0.01' },
    { name: 'service_speed', label: 'Service Speed (knots)', type: 'number' as const, step: '0.01' },
    { name: 'max_speed', label: 'Max Speed (knots)', type: 'number' as const, step: '0.01' },
    { name: 'fuel_consumption_sea', label: 'Fuel Consumption at Sea (tons/day)', type: 'number' as const, step: '0.01' },
    { name: 'fuel_consumption_port', label: 'Fuel Consumption in Port (tons/day)', type: 'number' as const, step: '0.01' },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="propulsion"
      title="Propulsion & Performance"
      fields={fields}
    />
  );
}
