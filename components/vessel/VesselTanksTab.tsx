'use client';
import GenericVesselTab from './GenericVesselTab';

export default function VesselTanksTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'cargo_tank_count', label: 'Number of Cargo Tanks', type: 'number' as const },
    { name: 'cargo_capacity_cbm', label: 'Cargo Capacity (CBM)', type: 'number' as const, step: '0.01' },
    { name: 'tank_coating_type', label: 'Tank Coating Type', type: 'text' as const },
    { name: 'heating_coil', label: 'Heating Coil', type: 'checkbox' as const },
    { name: 'hfo_capacity', label: 'HFO Fuel Capacity (tons)', type: 'number' as const, step: '0.01' },
    { name: 'mgo_capacity', label: 'MGO Fuel Capacity (tons)', type: 'number' as const, step: '0.01' },
    { name: 'lng_capacity', label: 'LNG Capacity (tons)', type: 'number' as const, step: '0.01' },
    { name: 'ballast_capacity', label: 'Ballast Capacity (CBM)', type: 'number' as const, step: '0.01' },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="tanks"
      title="Tank Capacities"
      fields={fields}
    />
  );
}
