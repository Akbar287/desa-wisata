import type { PaginationMeta } from "@/types/PaginationData";

export type RefundStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "CANCELLED";

export interface RefundItem {
  id: number;
  bookingId: number;
  bookingPaymentId: number;
  bookingCode: string;
  reason: string | null;
  termsAccepted: boolean;
  refundPercent: number;
  paidAmount: number;
  refundAmount: number;
  status: RefundStatus;
  requestedAt: string;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefundPageData {
  bookingId: number;
  bookingPaymentId: number;
  bookingCode: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  visitDate: string;
  paidAmount: number;
  refundPercent: number;
  refundAmount: number;
  eligible: boolean;
  ineligibleReason: string | null;
  refund: RefundItem | null;
}

export interface RefundApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface CreateRefundPayload {
  bookingCode: string;
  reason?: string;
  termsAccepted: boolean;
}

export interface AdminRefundListParams {
  page: number;
  limit: number;
  search?: string;
  status?: "ALL" | RefundStatus;
}

export interface AdminRefundListItem {
  id: number;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  visitDate: string;
  paidAmount: number;
  refundAmount: number;
  refundPercent: number;
  status: RefundStatus;
  reason: string | null;
  requestedAt: string;
  processedAt: string | null;
}

export interface AdminRefundDetailItem extends AdminRefundListItem {
  orderId: string;
  bookingPaymentId: number;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminRefundStatusPayload {
  status: RefundStatus;
}
