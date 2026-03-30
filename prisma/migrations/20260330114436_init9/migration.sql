/*
  Warnings:

  - You are about to drop the `payment_available` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_paymentAvailableId_fkey";

-- DropTable
DROP TABLE "payment_available";

-- DropTable
DROP TABLE "payments";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PaymentType";

-- CreateTable
CREATE TABLE "booking_payments" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "booking_code" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "transaction_id" TEXT,
    "gross_amount" DECIMAL(12,2),
    "currency" TEXT DEFAULT 'IDR',
    "payment_type" TEXT,
    "transaction_status" TEXT NOT NULL DEFAULT 'pending',
    "fraud_status" TEXT,
    "transaction_time" TIMESTAMP(3),
    "settlement_time" TIMESTAMP(3),
    "expiry_time" TIMESTAMP(3),
    "snap_token" TEXT,
    "redirect_url" TEXT,
    "midtrans_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_payments_booking_code_key" ON "booking_payments"("booking_code");

-- CreateIndex
CREATE UNIQUE INDEX "booking_payments_order_id_key" ON "booking_payments"("order_id");

-- AddForeignKey
ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
