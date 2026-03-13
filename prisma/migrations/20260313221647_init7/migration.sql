-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "destinationId" INTEGER,
ADD COLUMN     "wahanaId" INTEGER,
ALTER COLUMN "tourId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_wahanaId_fkey" FOREIGN KEY ("wahanaId") REFERENCES "wahanas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
