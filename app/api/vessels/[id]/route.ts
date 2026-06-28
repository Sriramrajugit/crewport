import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, validateVesselAccess } from '@/lib/accessControl';

// GET vessel by ID with all related data
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate user
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const vesselId = parseInt(id);
    
    // Validate user has access to this vessel
    const accessCheck = await validateVesselAccess(userId, vesselId);
    if (!accessCheck.allowed) {
      return NextResponse.json(
        { error: accessCheck.error || 'Access denied' },
        { status: 403 }
      );
    }

    const vessel = await prisma.vessel.findUnique({
      where: { id: vesselId },
      include: {
        vessel_ownership: true,
        vessel_commercial: true,
        vessel_technical: true,
        vessel_engine: true,
        vessel_propulsion: true,
        vessel_tanks: true,
        vessel_certificates: true,
        vessel_crew_config: true,
        vessel_navigation: true,
        vessel_environment: true,
        vessel_maintenance: true,
      },
    });

    if (!vessel) {
      return NextResponse.json({ error: 'Vessel not found' }, { status: 404 });
    }

    return NextResponse.json(vessel);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let userMessage = 'Unable to load vessel information';
    
    if (errorMessage.includes('not found')) {
      userMessage = 'Vessel not found. It may have been deleted.';
    } else if (errorMessage.includes('Unauthorized')) {
      userMessage = 'Your session has expired. Please log in again.';
    }

    console.error('Error fetching vessel:', errorMessage);
    return NextResponse.json(
      { error: userMessage, details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update vessel data
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let body: any;
  let vesselId: number = 0;
  try {
    // Authenticate user
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    const { id } = await params;
    vesselId = parseInt(id);
    
    // Validate user has access to this vessel
    const accessCheck = await validateVesselAccess(userId, vesselId);
    if (!accessCheck.allowed) {
      return NextResponse.json(
        { error: accessCheck.error || 'Access denied' },
        { status: 403 }
      );
    }

    body = await request.json();
    const { section, data } = body;

    // Update vessel master info
    if (section === 'master') {
      const masterData = {
        vessel_name: data.vessel_name,
        imo_number: data.imo_number,
        mmsi_number: data.mmsi_number,
        call_sign: data.call_sign,
        vessel_type: data.vessel_type,
        vessel_subtype: data.vessel_subtype,
        flag: data.flag,
        port_of_registry: data.port_of_registry,
        year_built: data.year_built ? parseInt(data.year_built) : null,
        builder: data.builder,
        hull_number: data.hull_number,
        classification_society: data.classification_society,
        class_notation: data.class_notation,
        status: data.status,
        greek_flag: data.greek_flag === true || data.greek_flag === 'true',
        registry_no: data.registry_no,
        nat_number: data.nat_number,
        ice_class: data.ice_class,
        vessel_value: data.vessel_value ? parseFloat(data.vessel_value) : null,
      };
      const updated = await prisma.vessel.update({
        where: { id: vesselId },
        data: masterData,
      });
      return NextResponse.json(updated);
    }

    // Update vessel ownership
    if (section === 'ownership') {
      const updated = await prisma.vesselOwnership.upsert({
        where: { vessel_id: vesselId },
        update: data,
        create: { vessel_id: vesselId, ...data },
      });
      return NextResponse.json(updated);
    }

    // Update vessel commercial
    if (section === 'commercial') {
      const commercialData = {
        ...data,
        charter_start: data.charter_start ? new Date(data.charter_start) : null,
        charter_end: data.charter_end ? new Date(data.charter_end) : null,
        hire_rate: data.hire_rate ? parseFloat(data.hire_rate) : null,
      };
      const updated = await prisma.vesselCommercial.upsert({
        where: { vessel_id: vesselId },
        update: commercialData,
        create: { vessel_id: vesselId, ...commercialData },
      });
      return NextResponse.json(updated);
    }

    // Update vessel technical
    if (section === 'technical') {
      const technicalData = {
        ...data,
        loa: data.loa ? parseFloat(data.loa) : null,
        lbp: data.lbp ? parseFloat(data.lbp) : null,
        breadth: data.breadth ? parseFloat(data.breadth) : null,
        depth: data.depth ? parseFloat(data.depth) : null,
        draft_summer: data.draft_summer ? parseFloat(data.draft_summer) : null,
        draft_winter: data.draft_winter ? parseFloat(data.draft_winter) : null,
        air_draft: data.air_draft ? parseFloat(data.air_draft) : null,
        gross_tonnage: data.gross_tonnage ? parseFloat(data.gross_tonnage) : null,
        net_tonnage: data.net_tonnage ? parseFloat(data.net_tonnage) : null,
        deadweight: data.deadweight ? parseFloat(data.deadweight) : null,
        lightship_weight: data.lightship_weight ? parseFloat(data.lightship_weight) : null,
      };
      const updated = await prisma.vesselTechnical.upsert({
        where: { vessel_id: vesselId },
        update: technicalData,
        create: { vessel_id: vesselId, ...technicalData },
      });
      return NextResponse.json(updated);
    }

    // Update vessel engine
    if (section === 'engine') {
      const engineData = {
        ...data,
        mcr_power_kw: data.mcr_power_kw ? parseFloat(data.mcr_power_kw) : null,
        rpm: data.rpm ? parseInt(data.rpm) : null,
        engine_rating: data.engine_rating ? parseFloat(data.engine_rating) : null,
        me_rpm_at_mcr: data.me_rpm_at_mcr ? parseInt(data.me_rpm_at_mcr) : null,
        ncr_rpm: data.ncr_rpm ? parseInt(data.ncr_rpm) : null,
        sfoc_max: data.sfoc_max ? parseFloat(data.sfoc_max) : null,
        sfoc_min: data.sfoc_min ? parseFloat(data.sfoc_min) : null,
        no_of_cylinders: data.no_of_cylinders ? parseInt(data.no_of_cylinders) : null,
        no_of_air_coolers: data.no_of_air_coolers ? parseInt(data.no_of_air_coolers) : null,
        me_cons_at_sea: data.me_cons_at_sea ? parseFloat(data.me_cons_at_sea) : null,
        no_of_generators: data.no_of_generators ? parseInt(data.no_of_generators) : null,
        generator_capacity_kw: data.generator_capacity_kw ? parseFloat(data.generator_capacity_kw) : null,
        boiler_capacity: data.boiler_capacity ? parseFloat(data.boiler_capacity) : null,
      };
      const updated = await prisma.vesselEngine.upsert({
        where: { vessel_id: vesselId },
        update: engineData,
        create: { vessel_id: vesselId, ...engineData },
      });
      return NextResponse.json(updated);
    }

    // Update vessel propulsion
    if (section === 'propulsion') {
      const propulsionData = {
        ...data,
        no_of_propellers: data.no_of_propellers ? parseInt(data.no_of_propellers) : null,
        propeller_diameter: data.propeller_diameter ? parseFloat(data.propeller_diameter) : null,
        propeller_pitch: data.propeller_pitch ? parseFloat(data.propeller_pitch) : null,
        bollard_pull: data.bollard_pull ? parseFloat(data.bollard_pull) : null,
        bow_thruster_kw: data.bow_thruster_kw ? parseFloat(data.bow_thruster_kw) : null,
        stern_thruster_kw: data.stern_thruster_kw ? parseFloat(data.stern_thruster_kw) : null,
        f_wind: data.f_wind ? parseFloat(data.f_wind) : null,
        p_wind: data.p_wind ? parseFloat(data.p_wind) : null,
        p_prop: data.p_prop ? parseFloat(data.p_prop) : null,
        service_speed: data.service_speed ? parseFloat(data.service_speed) : null,
        max_speed: data.max_speed ? parseFloat(data.max_speed) : null,
        fuel_consumption_sea: data.fuel_consumption_sea ? parseFloat(data.fuel_consumption_sea) : null,
        fuel_consumption_port: data.fuel_consumption_port ? parseFloat(data.fuel_consumption_port) : null,
        propellers_no: data.propellers_no ? parseInt(data.propellers_no) : null,
      };
      const updated = await prisma.vesselPropulsion.upsert({
        where: { vessel_id: vesselId },
        update: propulsionData,
        create: { vessel_id: vesselId, ...propulsionData },
      });
      return NextResponse.json(updated);
    }

    // Update vessel tanks
    if (section === 'tanks') {
      const tanksData = {
        ...data,
        cargo_tank_count: data.cargo_tank_count ? parseInt(data.cargo_tank_count) : null,
        cargo_capacity_cbm: data.cargo_capacity_cbm ? parseFloat(data.cargo_capacity_cbm) : null,
        hfo_capacity: data.hfo_capacity ? parseFloat(data.hfo_capacity) : null,
        mgo_capacity: data.mgo_capacity ? parseFloat(data.mgo_capacity) : null,
        lng_capacity: data.lng_capacity ? parseFloat(data.lng_capacity) : null,
        ballast_capacity: data.ballast_capacity ? parseFloat(data.ballast_capacity) : null,
      };
      const updated = await prisma.vesselTanks.upsert({
        where: { vessel_id: vesselId },
        update: tanksData,
        create: { vessel_id: vesselId, ...tanksData },
      });
      return NextResponse.json(updated);
    }

    // Update vessel crew config
    if (section === 'crew-config') {
      const crewConfigData = {
        ...data,
        crew_capacity: data.crew_capacity ? parseInt(data.crew_capacity) : null,
        officer_count: data.officer_count ? parseInt(data.officer_count) : null,
        rating_count: data.rating_count ? parseInt(data.rating_count) : null,
      };
      const updated = await prisma.vesselCrewConfig.upsert({
        where: { vessel_id: vesselId },
        update: crewConfigData,
        create: { vessel_id: vesselId, ...crewConfigData },
      });
      return NextResponse.json(updated);
    }

    // Update vessel navigation
    if (section === 'navigation') {
      const updated = await prisma.vesselNavigation.upsert({
        where: { vessel_id: vesselId },
        update: data,
        create: { vessel_id: vesselId, ...data },
      });
      return NextResponse.json(updated);
    }

    // Update vessel environment
    if (section === 'environment') {
      const updated = await prisma.vesselEnvironment.upsert({
        where: { vessel_id: vesselId },
        update: data,
        create: { vessel_id: vesselId, ...data },
      });
      return NextResponse.json(updated);
    }

    // Update vessel maintenance
    if (section === 'maintenance') {
      const maintenanceData = {
        pms_system_id: data.pms_system_id,
        last_dry_dock: data.last_dry_dock ? new Date(data.last_dry_dock) : null,
        next_dry_dock: data.next_dry_dock ? new Date(data.next_dry_dock) : null,
        last_survey: data.last_survey ? new Date(data.last_survey) : null,
        next_survey: data.next_survey ? new Date(data.next_survey) : null,
      };
      const updated = await prisma.vesselMaintenance.upsert({
        where: { vessel_id: vesselId },
        update: maintenanceData,
        create: { vessel_id: vesselId, ...maintenanceData },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Format error messages for user display
    let userMessage = 'Unable to save vessel information';
    let details = errorMessage;

    if (errorMessage.includes('Expected')) {
      userMessage = 'One or more fields have invalid values. Please check your entries.';
    } else if (errorMessage.includes('Unique constraint')) {
      userMessage = 'This vessel information already exists. Please check for duplicates.';
    } else if (errorMessage.includes('Foreign key')) {
      userMessage = 'One or more referenced values don\'t exist. Please verify your selections.';
    } else if (errorMessage.includes('premature end of input')) {
      userMessage = 'Date format is incorrect. Please use the date picker.';
    } else if (errorMessage.includes('DateTime')) {
      userMessage = 'One or more dates are in an invalid format.';
    }

    console.error('Error updating vessel:', {
      section: body?.section,
      vesselId,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { error: userMessage, details },
      { status: 500 }
    );
  }
}
