export type GallerySourceType = "destination" | "wahana" | "tour";

export interface GalleryItem {
  id: string;
  entityId: number;
  type: GallerySourceType;
  name: string;
  title: string;
  content: string;
  image: string;
  href: string;
  createdAt: string;
}

export interface GalleryPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface GalleryPageData {
  items: GalleryItem[];
  pagination: GalleryPagination;
}

export interface GalleryQuery {
  page: number;
  limit: number;
}
