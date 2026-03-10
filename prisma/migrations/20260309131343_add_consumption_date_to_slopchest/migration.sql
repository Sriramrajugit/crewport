-- CreateTable
CREATE TABLE "slopchest_items" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "item_name" VARCHAR(150) NOT NULL,
    "item_code" VARCHAR(50) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(50) NOT NULL DEFAULT 'units',
    "category" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slopchest_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slopchest_consumptions" (
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

    CONSTRAINT "slopchest_consumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slopchest_on_signers" (
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

    CONSTRAINT "slopchest_on_signers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_slopchest_item_company" ON "slopchest_items"("company_id");

-- CreateIndex
CREATE INDEX "idx_slopchest_item_active" ON "slopchest_items"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "slopchest_items_company_id_item_code_key" ON "slopchest_items"("company_id", "item_code");

-- CreateIndex
CREATE INDEX "idx_slopchest_consumption_vessel" ON "slopchest_consumptions"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_slopchest_consumption_crew" ON "slopchest_consumptions"("crew_member_id");

-- CreateIndex
CREATE INDEX "idx_slopchest_consumption_month_year" ON "slopchest_consumptions"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "slopchest_consumptions_vessel_id_crew_member_id_item_id_mon_key" ON "slopchest_consumptions"("vessel_id", "crew_member_id", "item_id", "month", "year");

-- CreateIndex
CREATE INDEX "idx_slopchest_onsigner_vessel" ON "slopchest_on_signers"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_slopchest_onsigner_month_year" ON "slopchest_on_signers"("month", "year");

-- AddForeignKey
ALTER TABLE "slopchest_items" ADD CONSTRAINT "slopchest_items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slopchest_consumptions" ADD CONSTRAINT "slopchest_consumptions_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slopchest_consumptions" ADD CONSTRAINT "slopchest_consumptions_crew_member_id_fkey" FOREIGN KEY ("crew_member_id") REFERENCES "crew_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slopchest_consumptions" ADD CONSTRAINT "slopchest_consumptions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "slopchest_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slopchest_consumptions" ADD CONSTRAINT "slopchest_consumptions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slopchest_on_signers" ADD CONSTRAINT "slopchest_on_signers_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slopchest_on_signers" ADD CONSTRAINT "slopchest_on_signers_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "slopchest_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slopchest_on_signers" ADD CONSTRAINT "slopchest_on_signers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
