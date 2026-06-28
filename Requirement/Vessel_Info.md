1. High-Level Architecture

Instead of one huge table, we split into modules:

Vessel_Master (core identity)
│
├── Vessel_Ownership
├── Vessel_Commercial
├── Vessel_Technical
├── Vessel_Engine
├── Vessel_Propulsion
├── Vessel_Tanks
├── Vessel_Certificates
├── Vessel_Crew_Config
├── Vessel_Navigation
├── Vessel_Environment
├── Vessel_Maintenance

👉 All linked via: vessel_id

🗄️ 2. SQL Schema (Production Ready)
🔷 2.1 Vessel Master (Core)
CREATE TABLE vessel_master (
    vessel_id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_name VARCHAR(100) NOT NULL,
    imo_number VARCHAR(20) UNIQUE NOT NULL,
    mmsi_number VARCHAR(20),
    call_sign VARCHAR(20),
    vessel_type VARCHAR(50),
    vessel_subtype VARCHAR(50),
    flag VARCHAR(50),
    port_of_registry VARCHAR(100),
    year_built INT,
    builder VARCHAR(100),
    hull_number VARCHAR(50),
    classification_society VARCHAR(50),
    class_notation VARCHAR(100),
    status VARCHAR(50), -- Active, Sold, Scrapped
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
🔷 2.2 Ownership & Management
CREATE TABLE vessel_ownership (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    registered_owner VARCHAR(150),
    beneficial_owner VARCHAR(150),
    technical_manager VARCHAR(150),
    commercial_manager VARCHAR(150),
    operator VARCHAR(150),
    ism_manager VARCHAR(150),
    isps_company VARCHAR(150),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.3 Commercial (Chartering)
CREATE TABLE vessel_commercial (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    charter_type VARCHAR(50), -- Time/Voyage/Bareboat
    charterer_name VARCHAR(150),
    charter_start DATE,
    charter_end DATE,
    pool_name VARCHAR(100),
    hire_rate DECIMAL(12,2),
    cost_center VARCHAR(50),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.4 Technical Particulars
CREATE TABLE vessel_technical (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    loa DECIMAL(10,2),
    lbp DECIMAL(10,2),
    breadth DECIMAL(10,2),
    depth DECIMAL(10,2),
    draft_summer DECIMAL(10,2),
    draft_winter DECIMAL(10,2),
    air_draft DECIMAL(10,2),
    gross_tonnage DECIMAL(12,2),
    net_tonnage DECIMAL(12,2),
    deadweight DECIMAL(12,2),
    lightship_weight DECIMAL(12,2),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.5 Engine Details
CREATE TABLE vessel_engine (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    main_engine_maker VARCHAR(100),
    main_engine_model VARCHAR(100),
    engine_type VARCHAR(50), -- 2-stroke / 4-stroke
    mcr_power_kw DECIMAL(12,2),
    rpm INT,
    fuel_type VARCHAR(50),
    no_of_generators INT,
    generator_capacity_kw DECIMAL(12,2),
    emergency_generator BOOLEAN,
    boiler_type VARCHAR(50),
    boiler_capacity DECIMAL(10,2),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.6 Propulsion & Performance
CREATE TABLE vessel_propulsion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    propeller_type VARCHAR(50),
    no_of_propellers INT,
    bow_thruster_kw DECIMAL(10,2),
    stern_thruster_kw DECIMAL(10,2),
    service_speed DECIMAL(5,2),
    max_speed DECIMAL(5,2),
    fuel_consumption_sea DECIMAL(10,2),
    fuel_consumption_port DECIMAL(10,2),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.7 Tank & Cargo
CREATE TABLE vessel_tanks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    cargo_tank_count INT,
    cargo_capacity_cbm DECIMAL(12,2),
    tank_coating_type VARCHAR(50),
    heating_coil BOOLEAN,
    hfo_capacity DECIMAL(12,2),
    mgo_capacity DECIMAL(12,2),
    lng_capacity DECIMAL(12,2),
    ballast_capacity DECIMAL(12,2),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.8 Certificates (Critical Table)
CREATE TABLE vessel_certificates (
    cert_id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    certificate_name VARCHAR(100),
    issuing_authority VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);

👉 This enables:

Expiry alerts
Compliance dashboard
🔷 2.9 Crew Configuration
CREATE TABLE vessel_crew_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    manning_agent VARCHAR(150),
    crew_capacity INT,
    officer_count INT,
    rating_count INT,
    nationality_mix VARCHAR(100),
    union_type VARCHAR(50),
    payroll_type VARCHAR(50),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.10 Navigation & Communication
CREATE TABLE vessel_navigation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    ais_type VARCHAR(50),
    radar_type VARCHAR(50),
    ecdis_model VARCHAR(100),
    gps_system VARCHAR(100),
    satcom VARCHAR(100),
    vdr BOOLEAN,
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.11 Environmental
CREATE TABLE vessel_environment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    bwts BOOLEAN,
    scrubber BOOLEAN,
    eexi_rating VARCHAR(20),
    cii_rating VARCHAR(20),
    emission_tier VARCHAR(20),
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔷 2.12 Maintenance / Survey
CREATE TABLE vessel_maintenance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vessel_id INT,
    pms_system_id VARCHAR(50),
    last_dry_dock DATE,
    next_dry_dock DATE,
    last_survey DATE,
    next_survey DATE,
    FOREIGN KEY (vessel_id) REFERENCES vessel_master(vessel_id)
);
🔗 3. Relationships (Simple View)
vessel_master = parent
All others = child tables (1:1 or 1:many)

👉 Certificates = 1:N
👉 Everything else = mostly 1:1