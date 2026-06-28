/*
  Warnings:

  - You are about to drop the column `country` on the `ports` table. All the data in the column will be lost.
  - You are about to drop the column `port_code` on the `ports` table. All the data in the column will be lost.
  - You are about to drop the column `port_name` on the `ports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `ports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `ports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ports` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ports_port_code_key";

-- AlterTable - Add new columns first
ALTER TABLE "ports" 
ADD COLUMN     "code" VARCHAR(20),
ADD COLUMN     "name" VARCHAR(100),
ADD COLUMN     "country_code" VARCHAR(10),
ADD COLUMN     "latitude" DECIMAL(10,6),
ADD COLUMN     "longitude" DECIMAL(10,6),
ADD COLUMN     "zone_code" VARCHAR(50);

-- Migrate data from old columns to new columns
UPDATE "ports" SET "code" = "port_code", "name" = "port_name", "country_code" = "country" WHERE "code" IS NULL;

-- Drop old columns
ALTER TABLE "ports" DROP COLUMN "country", DROP COLUMN "port_code", DROP COLUMN "port_name";

-- Make new columns NOT NULL
ALTER TABLE "ports" ALTER COLUMN "code" SET NOT NULL, ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ports_code_key" ON "ports"("code");
