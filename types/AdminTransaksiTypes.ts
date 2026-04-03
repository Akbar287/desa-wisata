import type { PaginationMeta } from "@/types/PaginationData";

export type AdminTransaksiEntityType =
  | "all"
  | "tour"
  | "destination"
  | "wahana";

export type AdminTransaksiItemType =
  | "TOUR"
  | "DESTINATION"
  | "WAHANA"
  | "UNKNOWN";

export type AdminTransaksiStatus =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "COMPLETED";
export type AdminTransaksiRefundStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "CANCELLED";

export type AdminTransaksiStatusDisplay =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "COMPLETED"
  | "REFUND";

export type AdminTransaksiStatusFilter =
  | "ALL"
  | AdminTransaksiStatus
  | "REFUND";

export interface AdminTransaksiListParams {
  page: number;
  limit: number;
  search?: string;
  visitDate?: string;
  entityType?: AdminTransaksiEntityType;
  entityId?: number | null;
  status?: AdminTransaksiStatusFilter;
}

export interface AdminTransaksiFilterOption {
  id: number;
  title?: string;
  name?: string;
}

export interface AdminTransaksiFilterOptionsResponse {
  tours: Array<{ id: number; title: string }>;
  destinations: Array<{ id: number; name: string }>;
  wahanas: Array<{ id: number; name: string }>;
}

export interface AdminTransaksiListItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  itemType: AdminTransaksiItemType;
  itemName: string;
  itemId: number | null;
  visitDate: string;
  visitEndDate: string;
  adults: number;
  children: number;
  totalPeople: number;
  totalPrice: number;
  bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  latestPaymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | null;
  refundStatus: AdminTransaksiRefundStatus | null;
  latestPaymentRefCode: string | null;
  latestPaymentAt: string | null;
  latestPaidAt: string | null;
  status: AdminTransaksiStatusDisplay;
  createdAt: string;
}

export interface AdminTransaksiPaymentDetail {
  id: number;
  paymentAvailableId: number;
  bookingId: number;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  referenceCode: string;
  proofOfPayment: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  paymentAvailable: {
    id: number;
    name: string;
    type: "BANK" | "WALLET" | "QRIS";
  };
}

export interface AdminTransaksiDetailItem {
  id: number;
  tourId: number | null;
  destinationId: number | null;
  wahanaId: number | null;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  nationality: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  adults: number;
  children: number;
  startDate: string;
  endDate: string;
  findUs: string;
  comments: string | null;
  status: AdminTransaksiStatusDisplay;
  refundStatus: AdminTransaksiRefundStatus | null;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  itemType: AdminTransaksiItemType;
  itemName: string;
  totalPeople: number;
  tour: { id: number; title: string } | null;
  destination: { id: number; name: string } | null;
  wahana: { id: number; name: string } | null;
  payments: AdminTransaksiPaymentDetail[];
}

export interface AdminTransaksiApiResponse<T = unknown> {
  status: string;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}
