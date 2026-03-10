-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(150) NOT NULL,
    "company_code" VARCHAR(50) NOT NULL,
    "contact_email" VARCHAR(150),
    "contact_phone" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "subscription_plan" VARCHAR(50),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "user_id" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" VARCHAR(100),
    "role_id" INTEGER NOT NULL,
    "vessel_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "last_login" TIMESTAMP(6),
    "login_attempts" INTEGER DEFAULT 0,
    "failed_login_timestamp" TIMESTAMP(6),
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessels" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "vessel_name" VARCHAR(150) NOT NULL,
    "imo_number" VARCHAR(50),
    "mmsi_number" VARCHAR(50),
    "vessel_type" VARCHAR(100),
    "flag_state" VARCHAR(100),
    "owner_company" VARCHAR(150),
    "length" DECIMAL(10,2),
    "beam" DECIMAL(10,2),
    "draft" DECIMAL(10,2),
    "gross_tonnage" DECIMAL(12,2),
    "net_tonnage" DECIMAL(12,2),
    "deadweight_tonnage" DECIMAL(12,2),
    "year_built" INTEGER,
    "engine_power" DECIMAL(10,2),
    "status" VARCHAR(50) DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vessels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_members" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "name" VARCHAR(150) NOT NULL,
    "rank" VARCHAR(100),
    "position" VARCHAR(100),
    "date_of_birth" DATE,
    "passport_number" VARCHAR(50),
    "nationality" VARCHAR(100),
    "contact_number" VARCHAR(20),
    "emergency_contact" VARCHAR(150),
    "emergency_contact_number" VARCHAR(20),
    "sign_on_date" DATE,
    "sign_off_date" DATE,
    "sign_on_port" VARCHAR(100),
    "sign_off_port" VARCHAR(100),
    "contract_file" TEXT,
    "contract_completed" BOOLEAN DEFAULT false,
    "not_completed_reason" TEXT,
    "medical_sign_off" BOOLEAN DEFAULT false,
    "medical_reason" TEXT,
    "certificate_expiry" DATE,
    "identification_document" TEXT,
    "onboarding_status" VARCHAR(50) DEFAULT 'PENDING',
    "documents_verified_by" INTEGER,
    "verified_at" TIMESTAMP(6),
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "crew_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_earnings" (
    "id" SERIAL NOT NULL,
    "crew_member_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basic_salary" DECIMAL(15,2),
    "fixed_overtime" DECIMAL(15,2),
    "leave_wages" DECIMAL(15,2),
    "other_allowances" DECIMAL(15,2),
    "travel_wages" DECIMAL(15,2),
    "hra" DECIMAL(15,2),
    "joining_expenses" DECIMAL(15,2),
    "onboard_allowance_short_manning" DECIMAL(15,2),
    "total_earnings" DECIMAL(15,2),
    "cash_drawn" DECIMAL(15,2),
    "home_allowance" DECIMAL(15,2),
    "bond_deduction" DECIMAL(15,2),
    "other_deduction" DECIMAL(15,2),
    "brought_forward" DECIMAL(15,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_token" VARCHAR(500) NOT NULL,
    "refresh_token" VARCHAR(500),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "login_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "logout_at" TIMESTAMP(6),

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "module" VARCHAR(50),
    "description" TEXT,
    "entity_id" INTEGER,
    "entity_type" VARCHAR(50),
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "status" VARCHAR(20) DEFAULT 'SUCCESS',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranks" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER,
    "rank_name" VARCHAR(100) NOT NULL,
    "rank_code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ports" (
    "id" SERIAL NOT NULL,
    "port_name" VARCHAR(100) NOT NULL,
    "port_code" VARCHAR(20) NOT NULL,
    "country" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "usd_to_local" DECIMAL(12,4) NOT NULL,
    "local_currency_code" VARCHAR(3) DEFAULT 'INR',
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reset_token" VARCHAR(500) NOT NULL,
    "token_expires_at" TIMESTAMP(6) NOT NULL,
    "is_used" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(6),

    CONSTRAINT "password_reset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "log_period" VARCHAR(50),
    "rfq_no" VARCHAR(100),
    "po_no" VARCHAR(100),
    "invoice_file" TEXT,
    "dn_file" TEXT,
    "base_amount_usd" DECIMAL(14,2) NOT NULL,
    "exchange_rate" DECIMAL(12,4) NOT NULL,
    "total_local" DECIMAL(14,2),
    "created_by" INTEGER NOT NULL,
    "approval_status" VARCHAR(50) DEFAULT 'PENDING',
    "approved_by" INTEGER,
    "approved_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_key" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "screen_access" BOOLEAN DEFAULT true,
    "can_create" BOOLEAN DEFAULT false,
    "can_read" BOOLEAN DEFAULT false,
    "can_update" BOOLEAN DEFAULT false,
    "can_delete" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_roles" (
    "id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "permissions" JSONB DEFAULT '[]',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_name_key" ON "companies"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_code_key" ON "companies"("company_code");

-- CreateIndex
CREATE INDEX "idx_companies_code" ON "companies"("company_code");

-- CreateIndex
CREATE INDEX "idx_companies_is_active" ON "companies"("is_active");

-- CreateIndex
CREATE INDEX "idx_users_company_id" ON "users"("company_id");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("company_id", "email");

-- CreateIndex
CREATE INDEX "idx_users_is_active" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "idx_users_role_id" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "idx_users_user_id" ON "users"("company_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_users_vessel_id" ON "users"("vessel_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_company_id_email_key" ON "users"("company_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_company_id_user_id_key" ON "users"("company_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_vessels_company_id" ON "vessels"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "vessels_company_id_imo_number_key" ON "vessels"("company_id", "imo_number");

-- CreateIndex
CREATE INDEX "idx_crew_company_id" ON "crew_members"("company_id");

-- CreateIndex
CREATE INDEX "idx_crew_onboarding_status" ON "crew_members"("onboarding_status");

-- CreateIndex
CREATE INDEX "idx_crew_sign_on_date" ON "crew_members"("sign_on_date");

-- CreateIndex
CREATE INDEX "idx_crew_user_id" ON "crew_members"("user_id");

-- CreateIndex
CREATE INDEX "idx_crew_vessel_id" ON "crew_members"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_crew_earnings_crew_id" ON "crew_earnings"("crew_member_id");

-- CreateIndex
CREATE INDEX "idx_crew_earnings_month_year" ON "crew_earnings"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "crew_earnings_crew_member_id_month_year_key" ON "crew_earnings"("crew_member_id", "month", "year");

-- CreateIndex
CREATE INDEX "idx_user_sessions_is_active" ON "user_sessions"("is_active");

-- CreateIndex
CREATE INDEX "idx_user_sessions_token" ON "user_sessions"("session_token");

-- CreateIndex
CREATE INDEX "idx_user_sessions_user_id" ON "user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_activity_log_created_at" ON "activity_log"("created_at");

-- CreateIndex
CREATE INDEX "idx_activity_log_entity" ON "activity_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_activity_log_user_id" ON "activity_log"("user_id");

-- CreateIndex
CREATE INDEX "idx_rank_company_id" ON "ranks"("company_id");

-- CreateIndex
CREATE INDEX "idx_rank_is_active" ON "ranks"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_rank_code_company_id_key" ON "ranks"("rank_code", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "ports_port_code_key" ON "ports"("port_code");

-- CreateIndex
CREATE INDEX "idx_port_is_active" ON "ports"("is_active");

-- CreateIndex
CREATE INDEX "idx_exchange_rates_company_id" ON "exchange_rates"("company_id");

-- CreateIndex
CREATE INDEX "idx_exchange_rates_effective_from" ON "exchange_rates"("company_id", "effective_from");

-- CreateIndex
CREATE INDEX "idx_exchange_rates_is_active" ON "exchange_rates"("company_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_reset_token_key" ON "password_reset"("reset_token");

-- CreateIndex
CREATE INDEX "idx_password_reset_reset_token" ON "password_reset"("reset_token");

-- CreateIndex
CREATE INDEX "idx_password_reset_user_id" ON "password_reset"("user_id");

-- CreateIndex
CREATE INDEX "idx_purchases_approval_status" ON "purchases"("approval_status");

-- CreateIndex
CREATE INDEX "idx_purchases_company_id" ON "purchases"("company_id");

-- CreateIndex
CREATE INDEX "idx_purchases_created_by" ON "purchases"("created_by");

-- CreateIndex
CREATE INDEX "idx_purchases_type" ON "purchases"("type");

-- CreateIndex
CREATE INDEX "idx_purchases_vessel_id" ON "purchases"("vessel_id");

-- CreateIndex
CREATE INDEX "idx_user_permissions_permission_key" ON "user_permissions"("permission_key");

-- CreateIndex
CREATE INDEX "idx_user_permissions_role_id" ON "user_permissions"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_role_id_permission_key_key" ON "user_permissions"("role_id", "permission_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_roles_role_name_key" ON "users_roles"("role_name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "users_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vessels" ADD CONSTRAINT "vessels_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_documents_verified_by_fkey" FOREIGN KEY ("documents_verified_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crew_earnings" ADD CONSTRAINT "crew_earnings_crew_member_id_fkey" FOREIGN KEY ("crew_member_id") REFERENCES "crew_members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ranks" ADD CONSTRAINT "ranks_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "users_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
