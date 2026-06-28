/*
  Warnings:

  - You are about to drop the column `beam` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `deadweight_tonnage` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `draft` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `engine_power` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `flag_state` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `gross_tonnage` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `net_tonnage` on the `vessels` table. All the data in the column will be lost.
  - You are about to drop the column `owner_company` on the `vessels` table. All the data in the column will be lost.
  - You are about to alter the column `mmsi_number` on the `vessels` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "vessels" DROP COLUMN "beam",
DROP COLUMN "deadweight_tonnage",
DROP COLUMN "draft",
DROP COLUMN "engine_power",
DROP COLUMN "flag_state",
DROP COLUMN "gross_tonnage",
DROP COLUMN "length",
DROP COLUMN "net_tonnage",
DROP COLUMN "owner_company",
ADD COLUMN     "builder" VARCHAR(100),
ADD COLUMN     "call_sign" VARCHAR(20),
ADD COLUMN     "class_notation" VARCHAR(100),
ADD COLUMN     "classification_society" VARCHAR(50),
ADD COLUMN     "flag" VARCHAR(50),
ADD COLUMN     "hull_number" VARCHAR(50),
ADD COLUMN     "port_of_registry" VARCHAR(100),
ADD COLUMN     "vessel_subtype" VARCHAR(50),
ALTER COLUMN "mmsi_number" SET DATA TYPE VARCHAR(20);

-- CreateTable
CREATE TABLE "vessel_ownership" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "registered_owner" VARCHAR(150),
    "beneficial_owner" VARCHAR(150),
    "technical_manager" VARCHAR(150),
    "commercial_manager" VARCHAR(150),
    "operator" VARCHAR(150),
    "ism_manager" VARCHAR(150),
    "isps_company" VARCHAR(150),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_ownership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_commercial" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "charter_type" VARCHAR(50),
    "charterer_name" VARCHAR(150),
    "charter_start" DATE,
    "charter_end" DATE,
    "pool_name" VARCHAR(100),
    "hire_rate" DECIMAL(12,2),
    "cost_center" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_commercial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_technical" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "loa" DECIMAL(10,2),
    "lbp" DECIMAL(10,2),
    "breadth" DECIMAL(10,2),
    "depth" DECIMAL(10,2),
    "draft_summer" DECIMAL(10,2),
    "draft_winter" DECIMAL(10,2),
    "air_draft" DECIMAL(10,2),
    "gross_tonnage" DECIMAL(12,2),
    "net_tonnage" DECIMAL(12,2),
    "deadweight" DECIMAL(12,2),
    "lightship_weight" DECIMAL(12,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_technical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_engine" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "main_engine_maker" VARCHAR(100),
    "main_engine_model" VARCHAR(100),
    "engine_type" VARCHAR(50),
    "mcr_power_kw" DECIMAL(12,2),
    "rpm" INTEGER,
    "fuel_type" VARCHAR(50),
    "no_of_generators" INTEGER,
    "generator_capacity_kw" DECIMAL(12,2),
    "emergency_generator" BOOLEAN DEFAULT false,
    "boiler_type" VARCHAR(50),
    "boiler_capacity" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_engine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_propulsion" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "propeller_type" VARCHAR(50),
    "no_of_propellers" INTEGER,
    "bow_thruster_kw" DECIMAL(10,2),
    "stern_thruster_kw" DECIMAL(10,2),
    "service_speed" DECIMAL(5,2),
    "max_speed" DECIMAL(5,2),
    "fuel_consumption_sea" DECIMAL(10,2),
    "fuel_consumption_port" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_propulsion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_tanks" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "cargo_tank_count" INTEGER,
    "cargo_capacity_cbm" DECIMAL(12,2),
    "tank_coating_type" VARCHAR(50),
    "heating_coil" BOOLEAN DEFAULT false,
    "hfo_capacity" DECIMAL(12,2),
    "mgo_capacity" DECIMAL(12,2),
    "lng_capacity" DECIMAL(12,2),
    "ballast_capacity" DECIMAL(12,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_tanks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_certificates" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "certificate_name" VARCHAR(100) NOT NULL,
    "issuing_authority" VARCHAR(100),
    "issue_date" DATE,
    "expiry_date" DATE,
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_crew_config" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "manning_agent" VARCHAR(150),
    "crew_capacity" INTEGER,
    "officer_count" INTEGER,
    "rating_count" INTEGER,
    "nationality_mix" VARCHAR(100),
    "union_type" VARCHAR(50),
    "payroll_type" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_crew_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_navigation" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "ais_type" VARCHAR(50),
    "radar_type" VARCHAR(50),
    "ecdis_model" VARCHAR(100),
    "gps_system" VARCHAR(100),
    "satcom" VARCHAR(100),
    "vdr" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_navigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_environment" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "bwts" BOOLEAN DEFAULT false,
    "scrubber" BOOLEAN DEFAULT false,
    "eexi_rating" VARCHAR(20),
    "cii_rating" VARCHAR(20),
    "emission_tier" VARCHAR(20),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_maintenance" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "pms_system_id" VARCHAR(50),
    "last_dry_dock" DATE,
    "next_dry_dock" DATE,
    "last_survey" DATE,
    "next_survey" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vessel_ownership_vessel_id_key" ON "vessel_ownership"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_ownership_vessel" ON "vessel_ownership"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_commercial_vessel_id_key" ON "vessel_commercial"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_commercial_vessel" ON "vessel_commercial"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_technical_vessel_id_key" ON "vessel_technical"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_technical_vessel" ON "vessel_technical"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_engine_vessel_id_key" ON "vessel_engine"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_engine_vessel" ON "vessel_engine"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_propulsion_vessel_id_key" ON "vessel_propulsion"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_propulsion_vessel" ON "vessel_propulsion"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_tanks_vessel_id_key" ON "vessel_tanks"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_tanks_vessel" ON "vessel_tanks"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_certificate_vessel" ON "vessel_certificates"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_certificate_expiry" ON "vessel_certificates"("expiry_date");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_crew_config_vessel_id_key" ON "vessel_crew_config"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_crew_config_vessel" ON "vessel_crew_config"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_navigation_vessel_id_key" ON "vessel_navigation"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_navigation_vessel" ON "vessel_navigation"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_environment_vessel_id_key" ON "vessel_environment"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_environment_vessel" ON "vessel_environment"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_maintenance_vessel_id_key" ON "vessel_maintenance"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_maintenance_vessel" ON "vessel_maintenance"("vessel_id");

-- AddForeignKey
ALTER TABLE "vessel_ownership" ADD CONSTRAINT "vessel_ownership_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_commercial" ADD CONSTRAINT "vessel_commercial_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_technical" ADD CONSTRAINT "vessel_technical_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_engine" ADD CONSTRAINT "vessel_engine_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_propulsion" ADD CONSTRAINT "vessel_propulsion_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_tanks" ADD CONSTRAINT "vessel_tanks_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_certificates" ADD CONSTRAINT "vessel_certificates_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_crew_config" ADD CONSTRAINT "vessel_crew_config_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_navigation" ADD CONSTRAINT "vessel_navigation_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_environment" ADD CONSTRAINT "vessel_environment_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_maintenance" ADD CONSTRAINT "vessel_maintenance_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
