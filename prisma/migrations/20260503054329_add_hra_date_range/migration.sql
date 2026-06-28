-- AlterTable
ALTER TABLE "crew_hra_entries" ADD COLUMN     "days_calculated" INTEGER DEFAULT 0,
ADD COLUMN     "hra_period_end" DATE,
ADD COLUMN     "hra_period_start" DATE;
