/*
  Warnings:

  - The primary key for the `negara` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `negaraId` on the `negara` table. All the data in the column will be lost.
  - You are about to drop the `BookingTestimoniAddOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anggotaTim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anggotaTimNegara` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategoriTim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimoniTim` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookingTestimoniAddOn" DROP CONSTRAINT "BookingTestimoniAddOn_BookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingTestimoniAddOn" DROP CONSTRAINT "BookingTestimoniAddOn_anggotaTimId_fkey";

-- DropForeignKey
ALTER TABLE "anggotaTim" DROP CONSTRAINT "anggotaTim_kategoriTimId_fkey";

-- DropForeignKey
ALTER TABLE "anggotaTimNegara" DROP CONSTRAINT "anggotaTimNegara_anggotaTimId_fkey";

-- DropForeignKey
ALTER TABLE "anggotaTimNegara" DROP CONSTRAINT "anggotaTimNegara_negaraId_fkey";

-- DropForeignKey
ALTER TABLE "testimoniTim" DROP CONSTRAINT "testimoniTim_BookingTestimoniAddOnId_fkey";

-- AlterTable
ALTER TABLE "negara" DROP CONSTRAINT "negara_pkey",
DROP COLUMN "negaraId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "negara_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '-';

-- DropTable
DROP TABLE "BookingTestimoniAddOn";

-- DropTable
DROP TABLE "anggotaTim";

-- DropTable
DROP TABLE "anggotaTimNegara";

-- DropTable
DROP TABLE "kategoriTim";

-- DropTable
DROP TABLE "testimoniTim";

-- CreateTable
CREATE TABLE "anggota_tim_negara" (
    "teamMemberId" INTEGER NOT NULL,
    "negaraId" INTEGER NOT NULL,

    CONSTRAINT "anggota_tim_negara_pkey" PRIMARY KEY ("teamMemberId","negaraId")
);

-- CreateTable
CREATE TABLE "booking_testimoni_add_on" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "teamMemberId" INTEGER NOT NULL,

    CONSTRAINT "booking_testimoni_add_on_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimoni_tim" (
    "testimoniTimId" SERIAL NOT NULL,
    "bookingTestimoniAddOnId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "testimonial" TEXT NOT NULL,

    CONSTRAINT "testimoni_tim_pkey" PRIMARY KEY ("testimoniTimId")
);

-- CreateIndex
CREATE INDEX "booking_testimoni_add_on_bookingId_idx" ON "booking_testimoni_add_on"("bookingId");

-- CreateIndex
CREATE INDEX "booking_testimoni_add_on_teamMemberId_idx" ON "booking_testimoni_add_on"("teamMemberId");

-- CreateIndex
CREATE INDEX "testimoni_tim_bookingTestimoniAddOnId_idx" ON "testimoni_tim"("bookingTestimoniAddOnId");

-- AddForeignKey
ALTER TABLE "anggota_tim_negara" ADD CONSTRAINT "anggota_tim_negara_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_tim_negara" ADD CONSTRAINT "anggota_tim_negara_negaraId_fkey" FOREIGN KEY ("negaraId") REFERENCES "negara"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_testimoni_add_on" ADD CONSTRAINT "booking_testimoni_add_on_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_testimoni_add_on" ADD CONSTRAINT "booking_testimoni_add_on_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimoni_tim" ADD CONSTRAINT "testimoni_tim_bookingTestimoniAddOnId_fkey" FOREIGN KEY ("bookingTestimoniAddOnId") REFERENCES "booking_testimoni_add_on"("id") ON DELETE CASCADE ON UPDATE CASCADE;
