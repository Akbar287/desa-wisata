export interface SendBookingPaidEmailPayload {
  bookingPaymentId?: number;
  bookingId?: number;
  force?: boolean;
}

export interface SendBookingPaidEmailResult {
  sent: boolean;
  skipped: boolean;
  to: string;
  bookingId: number;
  bookingPaymentId: number;
  bookingCode: string;
  reason?: string;
  messageId?: string | null;
}

export interface EmailApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
}
