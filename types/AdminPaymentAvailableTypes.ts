import type { PaymentType } from "@/types/PaymentAvailableType";
import type { PaginationMeta } from "@/types/PaginationData";

export interface AdminPaymentAvailableApiResponse<T = unknown> {
  status: string;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface AdminPaymentAvailableListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaymentTypeOption {
  value: PaymentType;
  label: string;
}

export type PaymentTypeBadgeMap = Record<
  PaymentType,
  { label: string; class: string }
>;
