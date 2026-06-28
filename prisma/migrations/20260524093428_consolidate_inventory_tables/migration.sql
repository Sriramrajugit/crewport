/*
  Warnings:

  - You are about to drop the `slopchest_consumptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `slopchest_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `slopchest_on_signers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "slopchest_consumptions" DROP CONSTRAINT "slopchest_consumptions_created_by_fkey";

-- DropForeignKey
ALTER TABLE "slopchest_consumptions" DROP CONSTRAINT "slopchest_consumptions_crew_member_id_fkey";

-- DropForeignKey
ALTER TABLE "slopchest_consumptions" DROP CONSTRAINT "slopchest_consumptions_item_id_fkey";

-- DropForeignKey
ALTER TABLE "slopchest_consumptions" DROP CONSTRAINT "slopchest_consumptions_vessel_id_fkey";

-- DropForeignKey
ALTER TABLE "slopchest_items" DROP CONSTRAINT "slopchest_items_company_id_fkey";

-- DropForeignKey
ALTER TABLE "slopchest_on_signers" DROP CONSTRAINT "slopchest_on_signers_created_by_fkey";

-- DropForeignKey
ALTER TABLE "slopchest_on_signers" DROP CONSTRAINT "slopchest_on_signers_item_id_fkey";

-- DropForeignKey
ALTER TABLE "slopchest_on_signers" DROP CONSTRAINT "slopchest_on_signers_vessel_id_fkey";

-- DropTable
DROP TABLE "slopchest_consumptions";

-- DropTable
DROP TABLE "slopchest_items";

-- DropTable
DROP TABLE "slopchest_on_signers";

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "inventory_type" VARCHAR(50) NOT NULL,
    "item_name" VARCHAR(150) NOT NULL,
    "item_code" VARCHAR(50) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "available_quantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "unit" VARCHAR(50) NOT NULL DEFAULT 'units',
    "category" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_consumptions" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "crew_member_id" INTEGER,
    "item_id" INTEGER NOT NULL,
    "consumption_date" DATE NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_deduction" DECIMAL(15,2) NOT NULL,
    "notes" VARCHAR(500),
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_consumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_on_signers" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "signer_name" VARCHAR(150) NOT NULL,
    "consumption_date" DATE NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_deduction" DECIMAL(15,2) NOT NULL,
    "remarks" VARCHAR(500),
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_on_signers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_inventory_item_company" ON "inventory_items"("company_id");

-- CreateIndex
CREATE INDEX "idx_inventory_item_type" ON "inventory_items"("inventory_type");

-- CreateIndex
CREATE INDEX "idx_inventory_item_active" ON "inventory_items"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_company_id_item_code_inventory_type_key" ON "inventory_items"("company_id", "item_code", "inventory_type");

-- CreateIndex
CREATE INDEX "idx_inventory_consumption_vessel" ON "inventory_consumptions"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_inventory_consumption_crew" ON "inventory_consumptions"("crew_member_id");

-- CreateIndex
CREATE INDEX "idx_inventory_consumption_item" ON "inventory_consumptions"("item_id");

-- CreateIndex
CREATE INDEX "idx_inventory_consumption_month_year" ON "inventory_consumptions"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_consumptions_vessel_id_crew_member_id_item_id_mon_key" ON "inventory_consumptions"("vessel_id", "crew_member_id", "item_id", "month", "year");

-- CreateIndex
CREATE INDEX "idx_inventory_onsigner_vessel" ON "inventory_on_signers"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_inventory_onsigner_item" ON "inventory_on_signers"("item_id");

-- CreateIndex
CREATE INDEX "idx_inventory_onsigner_month_year" ON "inventory_on_signers"("month", "year");

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_consumptions" ADD CONSTRAINT "inventory_consumptions_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_consumptions" ADD CONSTRAINT "inventory_consumptions_crew_member_id_fkey" FOREIGN KEY ("crew_member_id") REFERENCES "crew_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_consumptions" ADD CONSTRAINT "inventory_consumptions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_consumptions" ADD CONSTRAINT "inventory_consumptions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_on_signers" ADD CONSTRAINT "inventory_on_signers_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_on_signers" ADD CONSTRAINT "inventory_on_signers_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_on_signers" ADD CONSTRAINT "inventory_on_signers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
