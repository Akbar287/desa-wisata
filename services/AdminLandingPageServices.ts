import type {
  AdminLandingApiResponse,
  AdminLandingListParams,
  AdminLandingStatisticListResponse,
  AdminLandingWithUsListResponse,
  LandingStatisticFormData,
  LandingWithUsFormData,
} from "@/types/AdminLandingPageTypes";

const STAT_API = "/api/landing-page-statistics";
const WITHUS_API = "/api/landing-page-with-us";
const IMG_API = "/api/img";

function toQuery(params: AdminLandingListParams): string {
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

export async function uploadAdminLandingImage(file: File): Promise<{
  url: string | null;
  message?: string;
}> {
  const formData = new FormData();
  formData.append("files", file);
  const res = await fetch(IMG_API, { method: "POST", body: formData });
  const json = (await res.json()) as AdminLandingApiResponse<{ id: string }>;
  if (json.status === "success" && json.data?.id) {
    return { url: `${IMG_API}?_id=${json.data.id}` };
  }
  return { url: null, message: json.message || "Upload gagal" };
}

export async function getAdminLandingStatistics(
  params: AdminLandingListParams,
): Promise<AdminLandingStatisticListResponse> {
  return request<AdminLandingStatisticListResponse>(`${STAT_API}?${toQuery(params)}`);
}

export async function createAdminLandingStatistic(
  payload: LandingStatisticFormData,
): Promise<AdminLandingApiResponse> {
  return requestJson<AdminLandingApiResponse>(STAT_API, "POST", payload);
}

export async function updateAdminLandingStatistic(
  id: number,
  payload: LandingStatisticFormData,
): Promise<AdminLandingApiResponse> {
  return requestJson<AdminLandingApiResponse>(`${STAT_API}?_id=${id}`, "PUT", payload);
}

export async function deleteAdminLandingStatistic(
  id: number,
): Promise<AdminLandingApiResponse> {
  return request<AdminLandingApiResponse>(`${STAT_API}?_id=${id}`, {
    method: "DELETE",
  });
}

export async function getAdminLandingWithUs(
  params: AdminLandingListParams,
): Promise<AdminLandingWithUsListResponse> {
  return request<AdminLandingWithUsListResponse>(`${WITHUS_API}?${toQuery(params)}`);
}

export async function createAdminLandingWithUs(
  payload: LandingWithUsFormData,
): Promise<AdminLandingApiResponse> {
  return requestJson<AdminLandingApiResponse>(WITHUS_API, "POST", payload);
}

export async function updateAdminLandingWithUs(
  id: number,
  payload: LandingWithUsFormData,
): Promise<AdminLandingApiResponse> {
  return requestJson<AdminLandingApiResponse>(`${WITHUS_API}?_id=${id}`, "PUT", payload);
}

export async function deleteAdminLandingWithUs(
  id: number,
): Promise<AdminLandingApiResponse> {
  return request<AdminLandingApiResponse>(`${WITHUS_API}?_id=${id}`, {
    method: "DELETE",
  });
}
