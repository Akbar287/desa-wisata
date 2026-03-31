-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "refunds" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "booking_payment_id" INTEGER NOT NULL,
    "booking_code" TEXT NOT NULL,
    "reason" TEXT,
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "refund_percent" INTEGER NOT NULL DEFAULT 75,
    "paid_amount" DECIMAL(12,2) NOT NULL,
    "refund_amount" DECIMAL(12,2) NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'REQUESTED',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refunds_booking_payment_id_key" ON "refunds"("booking_payment_id");

-- CreateIndex
CREATE INDEX "refunds_booking_id_idx" ON "refunds"("booking_id");

-- CreateIndex
CREATE INDEX "refunds_booking_code_idx" ON "refunds"("booking_code");

-- CreateIndex
CREATE INDEX "refunds_status_idx" ON "refunds"("status");

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_booking_payment_id_fkey" FOREIGN KEY ("booking_payment_id") REFERENCES "booking_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
