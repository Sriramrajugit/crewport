/*
  Warnings:

  - A unique constraint covering the columns `[vessel_id,item_code,inventory_type]` on the table `inventory_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vessel_id` to the `inventory_items` table without a default value. This is not possible if the table is not empty.

*/

-- First, drop the old unique constraint
DROP INDEX IF EXISTS "inventory_items_company_id_item_code_inventory_type_key";

-- Add vessel_id as nullable first
ALTER TABLE "inventory_items" ADD COLUMN "vessel_id" INTEGER;

-- Update existing records: assume they belong to vessel 3 (Test Vessel 01)
-- In production, this would need to be determined from consumption/on-signer records
UPDATE "inventory_items" SET "vessel_id" = 3 WHERE "vessel_id" IS NULL;

-- Now make it NOT NULL
ALTER TABLE "inventory_items" ALTER COLUMN "vessel_id" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add the new unique constraint on vessel + item_code + inventory_type
CREATE UNIQUE INDEX "inventory_items_vessel_id_item_code_inventory_type_key" ON "inventory_items"("vessel_id", "item_code", "inventory_type");

-- Add index for vessel_id lookups
CREATE INDEX "idx_inventory_item_vessel" ON "inventory_items"("vessel_id");
