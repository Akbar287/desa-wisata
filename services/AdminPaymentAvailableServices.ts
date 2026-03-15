import type {
  AdminPaymentAvailableApiResponse,
  AdminPaymentAvailableListParams,
} from "@/types/AdminPaymentAvailableTypes";
import type {
  PaymentAvailableData,
  PaymentAvailableFormData,
} from "@/types/PaymentAvailableType";

const API_URL = "/api/payment-available";
const IMG_API = "/api/img";

function toQuery(params: AdminPaymentAvailableListParams): string {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set("search", params.search);
  return query.toString();
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return res.json() as Promise<T>;
}

async function requestJson<T>(
  url: string,
  method: "POST" | "PUT",
  body: unknown,
): Promise<T> {
  return request<T>(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function getAdminPaymentAvailableList(
  params: AdminPaymentAvailableListParams,
): Promise<AdminPaymentAvailableApiResponse<PaymentAvailableData[]>> {
  return request<AdminPaymentAvailableApiResponse<PaymentAvailableData[]>>(
    `${API_URL}?${toQuery(params)}`,
  );
}

export async function createAdminPaymentAvailable(
  payload: PaymentAvailableFormData,
): Promise<AdminPaymentAvailableApiResponse> {
  return requestJson<AdminPaymentAvailableApiResponse>(API_URL, "POST", payload);
}

export async function updateAdminPaymentAvailable(
  id: number,
  payload: PaymentAvailableFormData,
): Promise<AdminPaymentAvailableApiResponse> {
  return requestJson<AdminPaymentAvailableApiResponse>(
    `${API_URL}?_id=${id}`,
    "PUT",
    payload,
  );
}

export async function deleteAdminPaymentAvailable(
  id: number,
): Promise<AdminPaymentAvailableApiResponse> {
  return request<AdminPaymentAvailableApiResponse>(`${API_URL}?_id=${id}`, {
    method: "DELETE",
  });
}

export async function uploadAdminPaymentAvailableImage(file: File): Promise<{
  url: string | null;
  message?: string;
}> {
  const formData = new FormData();
  formData.append("files", file);
  const res = await fetch(IMG_API, { method: "POST", body: formData });
  const json = (await res.json()) as AdminPaymentAvailableApiResponse<{
    id: string;
  }>;
  if (json.status === "success" && json.data?.id) {
    return { url: `${IMG_API}?_id=${json.data.id}` };
  }
  return { url: null, message: json.message || "Gagal upload gambar" };
}
