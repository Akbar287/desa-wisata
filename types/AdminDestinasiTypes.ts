import type {
  DestinationDetail,
  DestinationListItem,
  RefOption,
} from "@/types/DestinationType";
import type { PaginationMeta } from "@/types/PaginationData";

export interface RefOptionFull extends RefOption {
  description: string;
  icon: string;
}

export interface MapRefOption {
  id: number;
  title: string;
  content: string;
  image: string;
  icon: string;
  lat: number;
  lng: number;
  fasilitas: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export interface MapPointPickerProps {
  apiKey: string;
  mapId: string;
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
}

export interface AdminDestinasiPaginationProps {
  pagination: PaginationMeta;
  page: number;
  limit: number;
  setPage: (page: number) => void;
}

export type AdminDestinasiViewMode = "list" | "manage";
export type AdminMasterKind = "label" | "accessibility" | "facility";

export interface AdminDestinasiRefData {
  labels: RefOptionFull[];
  accessibilities: RefOptionFull[];
  facilities: RefOptionFull[];
  maps: MapRefOption[];
}

export interface AdminDestinasiSubDialogState {
  type: string;
  mode: "add" | "edit";
  data?: Record<string, unknown>;
}

export interface AdminDestinasiSubDeleteDialogState {
  type: string;
  id: number;
  label: string;
}

export interface AdminDestinasiMasterDialogState {
  kind: AdminMasterKind;
  mode: "add" | "edit";
  data?: RefOptionFull;
}

export interface AdminDestinasiMasterDeleteDialogState {
  kind: AdminMasterKind;
  id: number;
  name: string;
}

export interface AdminDestinasiMapMasterDialogState {
  mode: "add" | "edit";
  data?: MapRefOption;
}

export interface AdminDestinasiMapMasterDeleteDialogState {
  id: number;
  title: string;
}

export interface AdminDestinasiApiResponse<T = unknown> {
  status: string;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface AdminDestinasiListParams {
  page: number;
  limit: number;
  search?: string;
}

export type AdminDestinasiListResponse = AdminDestinasiApiResponse<
  DestinationListItem[]
>;

export type AdminDestinasiDetailResponse =
  AdminDestinasiApiResponse<DestinationDetail>;
