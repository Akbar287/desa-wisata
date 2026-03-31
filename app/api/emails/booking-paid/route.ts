import { NextRequest, NextResponse } from "next/server";
import {
  sendBookingPaidEmailByBookingId,
  sendBookingPaidEmailByPaymentId,
} from "@/lib/email/BookingPaidEmailService";
import type {
  EmailApiResponse,
  SendBookingPaidEmailPayload,
  SendBookingPaidEmailResult,
} from "@/types/EmailTypes";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SendBookingPaidEmailPayload;
    const bookingPaymentId = Number(body.bookingPaymentId);
    const bookingId = Number(body.bookingId);
    const force = Boolean(body.force);

    let result: SendBookingPaidEmailResult;
    if (Number.isFinite(bookingPaymentId) && bookingPaymentId > 0) {
      result = await sendBookingPaidEmailByPaymentId(bookingPaymentId, force);
    } else if (Number.isFinite(bookingId) && bookingId > 0) {
      result = await sendBookingPaidEmailByBookingId(bookingId, force);
    } else {
      return NextResponse.json<EmailApiResponse>(
        {
          status: "error",
          message: "bookingPaymentId atau bookingId wajib diisi",
        },
        { status: 400 },
      );
    }

    return NextResponse.json<EmailApiResponse<SendBookingPaidEmailResult>>({
      status: "success",
      message: result.sent
        ? "Email berhasil dikirim"
        : "Pengiriman email dilewati",
      data: result,
    });
  } catch (err) {
    console.error("Send booking paid email API error:", err);
    return NextResponse.json<EmailApiResponse>(
      {
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Gagal mengirim email konfirmasi pembayaran",
      },
      { status: 500 },
    );
  }
}
