/*
  Warnings:

  - Added the required column `KuotaHarian` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durasiRekomendasi` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageBanner` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAktif` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jamBuka` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jamTutup` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimalGroup` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceGroup` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceWeekday` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceWeekend` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingId` to the `testimonials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "KuotaHarian" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "durasiRekomendasi" TEXT NOT NULL,
ADD COLUMN     "imageBanner" TEXT NOT NULL,
ADD COLUMN     "isAktif" BOOLEAN NOT NULL,
ADD COLUMN     "jamBuka" TEXT NOT NULL,
ADD COLUMN     "jamTutup" TEXT NOT NULL,
ADD COLUMN     "minimalGroup" INTEGER NOT NULL,
ADD COLUMN     "priceGroup" INTEGER NOT NULL,
ADD COLUMN     "priceWeekday" INTEGER NOT NULL,
ADD COLUMN     "priceWeekend" INTEGER NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "bookingId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "destination_labels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_accessibilities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_accessibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_facilities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_accessibility_destinations" (
    "destinationId" INTEGER NOT NULL,
    "accessibilityId" INTEGER NOT NULL,

    CONSTRAINT "destination_accessibility_destinations_pkey" PRIMARY KEY ("destinationId","accessibilityId")
);

-- CreateTable
CREATE TABLE "destination_facility_destinations" (
    "destinationId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,

    CONSTRAINT "destination_facility_destinations_pkey" PRIMARY KEY ("destinationId","facilityId")
);

-- CreateTable
CREATE TABLE "destination_label_destinations" (
    "destinationId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,

    CONSTRAINT "destination_label_destinations_pkey" PRIMARY KEY ("destinationId","labelId")
);

-- CreateTable
CREATE TABLE "destination_galleries" (
    "id" SERIAL NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destination_labels_name_key" ON "destination_labels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "destination_accessibilities_name_key" ON "destination_accessibilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "destination_facilities_name_key" ON "destination_facilities"("name");

-- AddForeignKey
ALTER TABLE "destination_accessibility_destinations" ADD CONSTRAINT "destination_accessibility_destinations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_accessibility_destinations" ADD CONSTRAINT "destination_accessibility_destinations_accessibilityId_fkey" FOREIGN KEY ("accessibilityId") REFERENCES "destination_accessibilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_facility_destinations" ADD CONSTRAINT "destination_facility_destinations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_facility_destinations" ADD CONSTRAINT "destination_facility_destinations_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "destination_facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_label_destinations" ADD CONSTRAINT "destination_label_destinations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_label_destinations" ADD CONSTRAINT "destination_label_destinations_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "destination_labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_galleries" ADD CONSTRAINT "destination_galleries_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
