import type {
  AdminRefundDetailItem,
  AdminRefundListItem,
  AdminRefundListParams,
  CreateRefundPayload,
  RefundApiResponse,
  RefundPageData,
  RefundStatus,
  UpdateAdminRefundStatusPayload,
} from "@/types/RefundTypes";

const REFUND_API = "/api/refunds";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return res.json() as Promise<T>;
}

function toQuery(params: AdminRefundListParams): string {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set("search", params.search);
  if (params.status && params.status !== "ALL")
    query.set("status", params.status);
  return query.toString();
}

export async function getRefundDetail(
  bookingCode: string,
): Promise<RefundApiResponse<RefundPageData>> {
  return request<RefundApiResponse<RefundPageData>>(
    `${REFUND_API}/${encodeURIComponent(bookingCode)}`,
  );
}

export async function createRefundRequest(
  payload: CreateRefundPayload,
): Promise<RefundApiResponse<{ refund: RefundPageData["refund"] }>> {
  return request<RefundApiResponse<{ refund: RefundPageData["refund"] }>>(
    REFUND_API,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export async function getAdminRefundList(
  params: AdminRefundListParams,
): Promise<RefundApiResponse<AdminRefundListItem[]>> {
  return request<RefundApiResponse<AdminRefundListItem[]>>(
    `${REFUND_API}/admin?${toQuery(params)}`,
  );
}

export async function getAdminRefundDetail(
  id: number,
): Promise<RefundApiResponse<AdminRefundDetailItem>> {
  return request<RefundApiResponse<AdminRefundDetailItem>>(
    `${REFUND_API}/admin/${id}`,
  );
}

export async function updateAdminRefundStatus(
  id: number,
  payload: UpdateAdminRefundStatusPayload,
): Promise<RefundApiResponse<AdminRefundDetailItem>> {
  return request<RefundApiResponse<AdminRefundDetailItem>>(
    `${REFUND_API}/admin/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export const REFUND_STATUS_OPTIONS: Array<{
  value: "ALL" | RefundStatus;
  label: string;
}> = [
  { value: "ALL", label: "Semua Status" },
  { value: "REQUESTED", label: "Diajukan" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
  { value: "PAID", label: "Sudah Dibayar" },
  { value: "CANCELLED", label: "Dibatalkan" },
];
