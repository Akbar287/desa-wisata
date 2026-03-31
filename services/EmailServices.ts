import type {
  EmailApiResponse,
  SendBookingPaidEmailPayload,
  SendBookingPaidEmailResult,
} from "@/types/EmailTypes";

const EMAIL_API = "/api/emails/booking-paid";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return res.json() as Promise<T>;
}

export async function sendBookingPaidEmail(
  payload: SendBookingPaidEmailPayload,
): Promise<EmailApiResponse<SendBookingPaidEmailResult>> {
  return request<EmailApiResponse<SendBookingPaidEmailResult>>(EMAIL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
