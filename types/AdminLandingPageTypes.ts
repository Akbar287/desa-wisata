import type {
  LandingPageStatisticData,
  LandingPageWithUsData,
} from "@/types/LandingPageType";
import type { PaginationMeta } from "@/types/PaginationData";

export interface AdminLandingImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export interface AdminLandingApiResponse<T = unknown> {
  status: string;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface AdminLandingListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface LandingStatisticFormData {
  title: string;
  count: number;
  image: string;
  order: number;
}

export interface LandingWithUsFormData {
  title: string;
  subtitle: string;
  image: string;
  order: number;
}

export type AdminLandingStatisticListResponse = AdminLandingApiResponse<
  LandingPageStatisticData[]
>;

export type AdminLandingWithUsListResponse = AdminLandingApiResponse<
  LandingPageWithUsData[]
>;
