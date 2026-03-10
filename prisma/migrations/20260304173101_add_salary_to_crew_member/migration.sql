-- AlterTable
ALTER TABLE "crew_members" ADD COLUMN     "basic_salary" DECIMAL(15,2),
ADD COLUMN     "fixed_overtime" DECIMAL(15,2),
ADD COLUMN     "hra" DECIMAL(15,2),
ADD COLUMN     "joining_expenses" DECIMAL(15,2),
ADD COLUMN     "leave_wages" DECIMAL(15,2),
ADD COLUMN     "onboard_allowance_short_manning" DECIMAL(15,2),
ADD COLUMN     "other_allowances" DECIMAL(15,2),
ADD COLUMN     "total_earnings" DECIMAL(15,2),
ADD COLUMN     "travel_wages" DECIMAL(15,2);
