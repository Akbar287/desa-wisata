-- Production-safe fix migration that consolidates:
-- 20260414153459_init13
-- 20260415093000_add_team_member_active_admin
-- 20260414162133_init13
-- 20260414162133_init14 (no-op)
-- 20260415033404_init16
-- 20260415034654_init17
--
-- This SQL is idempotent and avoids destructive drops/resets.

-- 1) testimonials.isPublished must be NOT NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'testimonials'
      AND column_name = 'isPublished'
  ) THEN
    UPDATE "testimonials"
    SET "isPublished" = false
    WHERE "isPublished" IS NULL;

    ALTER TABLE "testimonials"
      ALTER COLUMN "isPublished" SET DEFAULT false;

    ALTER TABLE "testimonials"
      ALTER COLUMN "isPublished" SET NOT NULL;
  END IF;
END $$;

-- 2) TeamMember extensions (bio, activeAdmin, status)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'team_members'
  ) THEN
    ALTER TABLE "team_members"
      ADD COLUMN IF NOT EXISTS "bio" TEXT;
    UPDATE "team_members" SET "bio" = '-' WHERE "bio" IS NULL;
    ALTER TABLE "team_members" ALTER COLUMN "bio" SET DEFAULT '-';
    ALTER TABLE "team_members" ALTER COLUMN "bio" SET NOT NULL;

    ALTER TABLE "team_members"
      ADD COLUMN IF NOT EXISTS "activeAdmin" BOOLEAN;
    UPDATE "team_members" SET "activeAdmin" = false WHERE "activeAdmin" IS NULL;
    ALTER TABLE "team_members" ALTER COLUMN "activeAdmin" SET DEFAULT false;
    ALTER TABLE "team_members" ALTER COLUMN "activeAdmin" SET NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'StatusTeamMember'
  ) THEN
    CREATE TYPE "StatusTeamMember" AS ENUM ('AKTIF', 'TIDAK AKTIF', 'CUTI');
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'team_members'
  ) THEN
    ALTER TABLE "team_members"
      ADD COLUMN IF NOT EXISTS "status" "StatusTeamMember";
    UPDATE "team_members" SET "status" = 'TIDAK AKTIF' WHERE "status" IS NULL;
    ALTER TABLE "team_members" ALTER COLUMN "status" SET DEFAULT 'TIDAK AKTIF';
    ALTER TABLE "team_members" ALTER COLUMN "status" SET NOT NULL;
  END IF;
END $$;

-- 3) Core tables for guide add-on/testimoni
CREATE TABLE IF NOT EXISTS "negara" (
  "id" SERIAL NOT NULL,
  "nama" TEXT NOT NULL,
  CONSTRAINT "negara_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "anggota_tim_negara" (
  "teamMemberId" INTEGER NOT NULL,
  "negaraId" INTEGER NOT NULL,
  CONSTRAINT "anggota_tim_negara_pkey" PRIMARY KEY ("teamMemberId", "negaraId")
);

CREATE TABLE IF NOT EXISTS "booking_testimoni_add_on" (
  "id" SERIAL NOT NULL,
  "bookingId" INTEGER NOT NULL,
  "teamMemberId" INTEGER NOT NULL,
  CONSTRAINT "booking_testimoni_add_on_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "testimoni_tim" (
  "testimoniTimId" SERIAL NOT NULL,
  "bookingTestimoniAddOnId" INTEGER NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL,
  "testimonial" TEXT NOT NULL,
  CONSTRAINT "testimoni_tim_pkey" PRIMARY KEY ("testimoniTimId")
);

CREATE INDEX IF NOT EXISTS "booking_testimoni_add_on_bookingId_idx"
  ON "booking_testimoni_add_on"("bookingId");
CREATE INDEX IF NOT EXISTS "booking_testimoni_add_on_teamMemberId_idx"
  ON "booking_testimoni_add_on"("teamMemberId");
CREATE INDEX IF NOT EXISTS "testimoni_tim_bookingTestimoniAddOnId_idx"
  ON "testimoni_tim"("bookingTestimoniAddOnId");

DO $$
BEGIN
  IF to_regclass('public.anggota_tim_negara') IS NOT NULL
     AND to_regclass('public.team_members') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'anggota_tim_negara_teamMemberId_fkey'
     )
  THEN
    ALTER TABLE "anggota_tim_negara"
      ADD CONSTRAINT "anggota_tim_negara_teamMemberId_fkey"
      FOREIGN KEY ("teamMemberId")
      REFERENCES "team_members"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.anggota_tim_negara') IS NOT NULL
     AND to_regclass('public.negara') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'anggota_tim_negara_negaraId_fkey'
     )
  THEN
    ALTER TABLE "anggota_tim_negara"
      ADD CONSTRAINT "anggota_tim_negara_negaraId_fkey"
      FOREIGN KEY ("negaraId")
      REFERENCES "negara"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.booking_testimoni_add_on') IS NOT NULL
     AND to_regclass('public.bookings') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'booking_testimoni_add_on_bookingId_fkey'
     )
  THEN
    ALTER TABLE "booking_testimoni_add_on"
      ADD CONSTRAINT "booking_testimoni_add_on_bookingId_fkey"
      FOREIGN KEY ("bookingId")
      REFERENCES "bookings"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.booking_testimoni_add_on') IS NOT NULL
     AND to_regclass('public.team_members') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'booking_testimoni_add_on_teamMemberId_fkey'
     )
  THEN
    ALTER TABLE "booking_testimoni_add_on"
      ADD CONSTRAINT "booking_testimoni_add_on_teamMemberId_fkey"
      FOREIGN KEY ("teamMemberId")
      REFERENCES "team_members"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.testimoni_tim') IS NOT NULL
     AND to_regclass('public.booking_testimoni_add_on') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'testimoni_tim_bookingTestimoniAddOnId_fkey'
     )
  THEN
    ALTER TABLE "testimoni_tim"
      ADD CONSTRAINT "testimoni_tim_bookingTestimoniAddOnId_fkey"
      FOREIGN KEY ("bookingTestimoniAddOnId")
      REFERENCES "booking_testimoni_add_on"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;

-- 4) TeamHargaPemandu
CREATE TABLE IF NOT EXISTS "TeamHargaPemandu" (
  "id" SERIAL NOT NULL,
  "teamMemberId" INTEGER NOT NULL,
  "harga" TEXT NOT NULL,
  CONSTRAINT "TeamHargaPemandu_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF to_regclass('public."TeamHargaPemandu"') IS NOT NULL
     AND to_regclass('public.team_members') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'TeamHargaPemandu_teamMemberId_fkey'
     )
  THEN
    ALTER TABLE "TeamHargaPemandu"
      ADD CONSTRAINT "TeamHargaPemandu_teamMemberId_fkey"
      FOREIGN KEY ("teamMemberId")
      REFERENCES "team_members"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;
