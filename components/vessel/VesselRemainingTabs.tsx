'use client';
import GenericVesselTab from './GenericVesselTab';

export function VesselPropulsionTab({ vessel, onDataUpdate }: any) {
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

export function VesselTanksTab({ vessel, onDataUpdate }: any) {
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

export function VesselCrewConfigTab({ vessel, onDataUpdate }: any) {
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

export function VesselNavigationTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'ais_type', label: 'AIS Type', type: 'text' as const },
    { name: 'radar_type', label: 'Radar Type', type: 'text' as const },
    { name: 'ecdis_model', label: 'ECDIS Model', type: 'text' as const },
    { name: 'gps_system', label: 'GPS System', type: 'text' as const },
    { name: 'satcom', label: 'Satcom System', type: 'text' as const },
    { name: 'vdr', label: 'VDR (Black Box)', type: 'checkbox' as const },
  ];

  return (
    <GenericVesselTab
      vessel={vessel}
      onDataUpdate={onDataUpdate}
      section="navigation"
      title="Navigation & Communication"
      fields={fields}
    />
  );
}

export function VesselEnvironmentTab({ vessel, onDataUpdate }: any) {
  const fields = [
    { name: 'bwts', label: 'Ballast Water Treatment System', type: 'checkbox' as const },
    { name: 'scrubber', label: 'Scrubber System', type: 'checkbox' as const },
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

export function VesselMaintenanceTab({ vessel, onDataUpdate }: any) {
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
      title="Maintenance & Survey Schedule"
      fields={fields}
    />
  );
}
