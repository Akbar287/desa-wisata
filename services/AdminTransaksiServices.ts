import type {
  AdminTransaksiApiResponse,
  AdminTransaksiDetailItem,
  AdminTransaksiFilterOptionsResponse,
  AdminTransaksiListItem,
  AdminTransaksiListParams,
} from "@/types/AdminTransaksiTypes";

const API_URL = "/api/bookings/admin";

function toQuery(params: AdminTransaksiListParams): string {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search) query.set("search", params.search);
  if (params.visitDate) query.set("visitDate", params.visitDate);
  if (params.entityType && params.entityType !== "all") {
    query.set("entityType", params.entityType);
  }
  if (
    params.entityType &&
    params.entityType !== "all" &&
    params.entityId &&
    params.entityId > 0
  ) {
    query.set("entityId", String(params.entityId));
  }
  if (params.status && params.status !== "ALL") {
    query.set("status", params.status);
  }

  return query.toString();
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return res.json() as Promise<T>;
}

export async function getAdminTransaksiList(
  params: AdminTransaksiListParams,
): Promise<AdminTransaksiApiResponse<AdminTransaksiListItem[]>> {
  return request<AdminTransaksiApiResponse<AdminTransaksiListItem[]>>(
    `${API_URL}?${toQuery(params)}`,
  );
}

export async function getAdminTransaksiFilterOptions(): Promise<
  AdminTransaksiApiResponse<AdminTransaksiFilterOptionsResponse>
> {
  return request<
    AdminTransaksiApiResponse<AdminTransaksiFilterOptionsResponse>
  >(`${API_URL}/filter-options`);
}

export async function getAdminTransaksiDetail(
  id: number,
): Promise<AdminTransaksiApiResponse<AdminTransaksiDetailItem>> {
  return request<AdminTransaksiApiResponse<AdminTransaksiDetailItem>>(
    `${API_URL}/${id}`,
  );
}
