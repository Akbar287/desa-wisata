import type {
  AdminDestinasiApiResponse,
  AdminDestinasiDetailResponse,
  AdminDestinasiListParams,
  AdminDestinasiListResponse,
  AdminDestinasiRefData,
  AdminMasterKind,
} from "@/types/AdminDestinasiTypes";

const API = "/api/destinations/admin";
const IMG_API = "/api/img";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, init);
  return res.json() as Promise<T>;
}

async function requestJson<T>(
  path: string,
  method: "POST" | "PUT",
  body: unknown,
): Promise<T> {
  return request<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function toQuery(params: AdminDestinasiListParams): string {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set("search", params.search);
  return query.toString();
}

export async function uploadAdminDestinasiImage(file: File): Promise<{
  url: string | null;
  message?: string;
}> {
  const formData = new FormData();
  formData.append("files", file);
  const res = await fetch(IMG_API, { method: "POST", body: formData });
  const json = (await res.json()) as AdminDestinasiApiResponse<{ id: string }>;
  if (json.status === "success" && json.data?.id) {
    return { url: `${IMG_API}?_id=${json.data.id}` };
  }
  return { url: null, message: json.message || "Upload gagal" };
}

export async function getAdminDestinasiList(
  params: AdminDestinasiListParams,
): Promise<AdminDestinasiListResponse> {
  return request<AdminDestinasiListResponse>(`/?${toQuery(params)}`);
}

export async function getAdminDestinasiDetail(
  id: number,
): Promise<AdminDestinasiDetailResponse> {
  return request<AdminDestinasiDetailResponse>(`/detail?_id=${id}`);
}

export async function getAdminDestinasiRefs(): Promise<
  AdminDestinasiApiResponse<AdminDestinasiRefData>
> {
  return request<AdminDestinasiApiResponse<AdminDestinasiRefData>>("/ref");
}

export async function createAdminDestinasi(
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>("/", "POST", payload);
}

export async function updateAdminDestinasi(
  id: number,
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>(`/?_id=${id}`, "PUT", payload);
}

export async function deleteAdminDestinasi(
  id: number,
): Promise<AdminDestinasiApiResponse> {
  return request<AdminDestinasiApiResponse>(`/?_id=${id}`, { method: "DELETE" });
}

export async function createAdminDestinasiSubResource(
  type: string,
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>(`/${type}`, "POST", payload);
}

export async function updateAdminDestinasiSubResource(
  type: string,
  id: number,
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>(
    `/${type}?_id=${id}`,
    "PUT",
    payload,
  );
}

export async function deleteAdminDestinasiSubResource(
  type: string,
  id: number,
): Promise<AdminDestinasiApiResponse> {
  return request<AdminDestinasiApiResponse>(`/${type}?_id=${id}`, {
    method: "DELETE",
  });
}

export async function saveAdminDestinasiLabels(
  destinationId: number,
  labelIds: number[],
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>("/labels", "POST", {
    destinationId,
    labelIds,
  });
}

export async function saveAdminDestinasiAccessibilities(
  destinationId: number,
  accessibilityIds: number[],
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>("/accessibilities", "POST", {
    destinationId,
    accessibilityIds,
  });
}

export async function saveAdminDestinasiFacilities(
  destinationId: number,
  facilityIds: number[],
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>("/facilities", "POST", {
    destinationId,
    facilityIds,
  });
}

export async function saveAdminDestinasiMaps(
  destinationId: number,
  mapIds: number[],
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>("/maps", "POST", {
    destinationId,
    mapIds,
  });
}

const masterEndpointMap: Record<AdminMasterKind, string> = {
  label: "/label-master",
  accessibility: "/accessibility-master",
  facility: "/facility-master",
};

export function getAdminDestinasiMasterEndpoint(kind: AdminMasterKind): string {
  return masterEndpointMap[kind];
}

export async function createAdminDestinasiMaster(
  kind: AdminMasterKind,
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>(
    getAdminDestinasiMasterEndpoint(kind),
    "POST",
    payload,
  );
}

export async function updateAdminDestinasiMaster(
  kind: AdminMasterKind,
  id: number,
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>(
    `${getAdminDestinasiMasterEndpoint(kind)}?_id=${id}`,
    "PUT",
    payload,
  );
}

export async function deleteAdminDestinasiMaster(
  kind: AdminMasterKind,
  id: number,
): Promise<AdminDestinasiApiResponse> {
  return request<AdminDestinasiApiResponse>(
    `${getAdminDestinasiMasterEndpoint(kind)}?_id=${id}`,
    { method: "DELETE" },
  );
}

export async function createAdminDestinasiMapMaster(
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>("/map-master", "POST", payload);
}

export async function updateAdminDestinasiMapMaster(
  id: number,
  payload: unknown,
): Promise<AdminDestinasiApiResponse> {
  return requestJson<AdminDestinasiApiResponse>(
    `/map-master?_id=${id}`,
    "PUT",
    payload,
  );
}

export async function deleteAdminDestinasiMapMaster(
  id: number,
): Promise<AdminDestinasiApiResponse> {
  return request<AdminDestinasiApiResponse>(`/map-master?_id=${id}`, {
    method: "DELETE",
  });
}
