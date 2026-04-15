/*
  Warnings:

  - Made the column `isPublished` on table `testimonials` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "testimonials" ALTER COLUMN "isPublished" SET NOT NULL;

-- CreateTable
CREATE TABLE "kategoriTim" (
    "kategoriTimId" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kategoriTim_pkey" PRIMARY KEY ("kategoriTimId")
);

-- CreateTable
CREATE TABLE "anggotaTim" (
    "anggotaTimId" SERIAL NOT NULL,
    "kategoriTimId" INTEGER NOT NULL,
    "jabatan" TEXT NOT NULL,
    "Urutan" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "statusAktifAdmin" BOOLEAN NOT NULL DEFAULT true,
    "statusAktifMandiri" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "anggotaTim_pkey" PRIMARY KEY ("anggotaTimId")
);

-- CreateTable
CREATE TABLE "negara" (
    "negaraId" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "negara_pkey" PRIMARY KEY ("negaraId")
);

-- CreateTable
CREATE TABLE "anggotaTimNegara" (
    "anggotaTimId" INTEGER NOT NULL,
    "negaraId" INTEGER NOT NULL,

    CONSTRAINT "anggotaTimNegara_pkey" PRIMARY KEY ("anggotaTimId","negaraId")
);

-- CreateTable
CREATE TABLE "BookingTestimoniAddOn" (
    "BookingTestimoniAddOnId" SERIAL NOT NULL,
    "BookingId" INTEGER NOT NULL,
    "anggotaTimId" INTEGER NOT NULL,

    CONSTRAINT "BookingTestimoniAddOn_pkey" PRIMARY KEY ("BookingTestimoniAddOnId")
);

-- CreateTable
CREATE TABLE "testimoniTim" (
    "testimoniTimId" SERIAL NOT NULL,
    "BookingTestimoniAddOnId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "testimonial" TEXT NOT NULL,

    CONSTRAINT "testimoniTim_pkey" PRIMARY KEY ("testimoniTimId")
);

-- CreateIndex
CREATE INDEX "BookingTestimoniAddOn_BookingId_idx" ON "BookingTestimoniAddOn"("BookingId");

-- CreateIndex
CREATE INDEX "BookingTestimoniAddOn_anggotaTimId_idx" ON "BookingTestimoniAddOn"("anggotaTimId");

-- CreateIndex
CREATE INDEX "testimoniTim_BookingTestimoniAddOnId_idx" ON "testimoniTim"("BookingTestimoniAddOnId");

-- AddForeignKey
ALTER TABLE "anggotaTim" ADD CONSTRAINT "anggotaTim_kategoriTimId_fkey" FOREIGN KEY ("kategoriTimId") REFERENCES "kategoriTim"("kategoriTimId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggotaTimNegara" ADD CONSTRAINT "anggotaTimNegara_anggotaTimId_fkey" FOREIGN KEY ("anggotaTimId") REFERENCES "anggotaTim"("anggotaTimId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggotaTimNegara" ADD CONSTRAINT "anggotaTimNegara_negaraId_fkey" FOREIGN KEY ("negaraId") REFERENCES "negara"("negaraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTestimoniAddOn" ADD CONSTRAINT "BookingTestimoniAddOn_BookingId_fkey" FOREIGN KEY ("BookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTestimoniAddOn" ADD CONSTRAINT "BookingTestimoniAddOn_anggotaTimId_fkey" FOREIGN KEY ("anggotaTimId") REFERENCES "anggotaTim"("anggotaTimId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimoniTim" ADD CONSTRAINT "testimoniTim_BookingTestimoniAddOnId_fkey" FOREIGN KEY ("BookingTestimoniAddOnId") REFERENCES "BookingTestimoniAddOn"("BookingTestimoniAddOnId") ON DELETE CASCADE ON UPDATE CASCADE;
