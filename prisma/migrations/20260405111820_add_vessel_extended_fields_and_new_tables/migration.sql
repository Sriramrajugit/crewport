-- AlterTable
ALTER TABLE "vessel_commercial" ADD COLUMN     "safety_no" VARCHAR(100),
ADD COLUMN     "shipowner" VARCHAR(150),
ADD COLUMN     "shipowner_platform" VARCHAR(150),
ADD COLUMN     "use_operator_acc" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "vessel_engine" ADD COLUMN     "engine_rating" VARCHAR(100),
ADD COLUMN     "lng_fuel_consumer_unit_class" VARCHAR(100),
ADD COLUMN     "main_engine_no" VARCHAR(100),
ADD COLUMN     "me_cons_at_sea" DECIMAL(10,2),
ADD COLUMN     "me_rpm_at_mcr" INTEGER,
ADD COLUMN     "ncr_rpm" INTEGER,
ADD COLUMN     "no_of_air_coolers" INTEGER,
ADD COLUMN     "no_of_cylinders" INTEGER,
ADD COLUMN     "sfoc_max" DECIMAL(10,2),
ADD COLUMN     "sfoc_min" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "vessel_ownership" ADD COLUMN     "crew_manager" VARCHAR(150),
ADD COLUMN     "group_manager" VARCHAR(150),
ADD COLUMN     "official_manager" VARCHAR(150),
ADD COLUMN     "ship_manager" VARCHAR(150),
ADD COLUMN     "superintendent" VARCHAR(150);

-- AlterTable
ALTER TABLE "vessel_propulsion" ADD COLUMN     "bollard_pull" DECIMAL(12,2),
ADD COLUMN     "f_wind" VARCHAR(50),
ADD COLUMN     "p_prop" VARCHAR(50),
ADD COLUMN     "p_wind" VARCHAR(50),
ADD COLUMN     "propeller_diameter" DECIMAL(10,2),
ADD COLUMN     "propeller_pitch" DECIMAL(10,2),
ADD COLUMN     "propellers_no" INTEGER;

-- AlterTable
ALTER TABLE "vessels" ADD COLUMN     "greek_flag" BOOLEAN DEFAULT false,
ADD COLUMN     "ice_class" VARCHAR(50),
ADD COLUMN     "nat_number" VARCHAR(50),
ADD COLUMN     "registry_no" VARCHAR(50),
ADD COLUMN     "vessel_value" DECIMAL(18,2);

-- CreateTable
CREATE TABLE "vessel_clear_deck" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "clear_deck_length" DECIMAL(10,2),
    "clear_deck_breadth" DECIMAL(10,2),
    "clear_deck_area" DECIMAL(12,2),
    "clear_deck_strength" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_clear_deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_steering_gear" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "rudders_no" INTEGER,
    "rudders_type" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_steering_gear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_side_thrusters" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "bow_thruster_no" INTEGER,
    "stern_thruster_no" INTEGER,
    "bow_thruster_rating" DECIMAL(10,2),
    "stern_thruster_rating" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_side_thrusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessel_general_details" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(150),
    "short_name" VARCHAR(100),
    "x_name_1" VARCHAR(150),
    "x_name_2" VARCHAR(150),
    "type" VARCHAR(100),
    "prefix" VARCHAR(50),
    "initials" VARCHAR(50),
    "sorting" VARCHAR(100),
    "fleet" VARCHAR(100),
    "vessel_type_2" VARCHAR(100),
    "vessel_group" VARCHAR(100),
    "wage_scale" VARCHAR(100),
    "vessel_class" VARCHAR(100),
    "show_on_scheduling" BOOLEAN DEFAULT false,
    "active_for_chartering" BOOLEAN DEFAULT false,
    "virtual" BOOLEAN DEFAULT false,
    "own" BOOLEAN DEFAULT false,
    "shuttle_tanker" BOOLEAN DEFAULT false,
    "active" BOOLEAN DEFAULT true,
    "reason" VARCHAR(100),
    "valid_until" DATE,
    "date_in_fleet" DATE,
    "hull_machinery" VARCHAR(100),
    "fd_d" VARCHAR(100),
    "p_i" VARCHAR(100),
    "fleet_vessel_ident" VARCHAR(100),
    "lead_vessel_id" VARCHAR(100),
    "shipping_name" VARCHAR(150),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessel_general_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vessel_clear_deck_vessel_id_key" ON "vessel_clear_deck"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_clear_deck_vessel" ON "vessel_clear_deck"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_steering_gear_vessel_id_key" ON "vessel_steering_gear"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_steering_gear_vessel" ON "vessel_steering_gear"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_side_thrusters_vessel_id_key" ON "vessel_side_thrusters"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_side_thrusters_vessel" ON "vessel_side_thrusters"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_general_details_vessel_id_key" ON "vessel_general_details"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_vessel_general_details_vessel" ON "vessel_general_details"("vessel_id");

-- AddForeignKey
ALTER TABLE "vessel_clear_deck" ADD CONSTRAINT "vessel_clear_deck_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_steering_gear" ADD CONSTRAINT "vessel_steering_gear_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_side_thrusters" ADD CONSTRAINT "vessel_side_thrusters_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vessel_general_details" ADD CONSTRAINT "vessel_general_details_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
