-- CreateTable
CREATE TABLE "user_vessels" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "role_on_vessel" VARCHAR(50) DEFAULT 'VESSEL_USER',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_vessels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_vessels_user_id" ON "user_vessels"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_vessels_vessel_id" ON "user_vessels"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_user_vessels_is_active" ON "user_vessels"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_vessels_user_id_vessel_id_key" ON "user_vessels"("user_id", "vessel_id");

-- AddForeignKey
ALTER TABLE "user_vessels" ADD CONSTRAINT "user_vessels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_vessels" ADD CONSTRAINT "user_vessels_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
