-- CreateTable
CREATE TABLE "crew_travel_wages_entries" (
    "id" SERIAL NOT NULL,
    "crew_member_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "travel_wages_date" DATE NOT NULL,
    "days_calculated" INTEGER DEFAULT 0,
    "travel_wages_amount" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_travel_wages_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_crew_travel_wages_crew_id" ON "crew_travel_wages_entries"("crew_member_id");

-- CreateIndex
CREATE INDEX "idx_crew_travel_wages_month_year" ON "crew_travel_wages_entries"("crew_member_id", "month", "year");

-- CreateIndex
CREATE INDEX "idx_crew_travel_wages_month_year_all" ON "crew_travel_wages_entries"("month", "year");

-- AddForeignKey
ALTER TABLE "crew_travel_wages_entries" ADD CONSTRAINT "crew_travel_wages_entries_crew_member_id_fkey" FOREIGN KEY ("crew_member_id") REFERENCES "crew_members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
