import type {
  AdminBlogDetail,
  AdminBlogListItem,
  BlogAuthorFormData,
  BlogAuthorItem,
  BlogPostFormData,
  BlogPostOption,
  BlogTagFormData,
} from "@/types/AdminBlogType"
import type { PaginationMeta } from "@/types/PaginationData"

export type { AdminBlogDetail, AdminBlogListItem, BlogAuthorFormData, BlogAuthorItem, BlogPostFormData, BlogPostOption, BlogTagFormData }

export type AdminBlogViewMode = "list" | "manage" | "authors"

export interface AdminBlogRefData {
  authors: BlogAuthorItem[]
  posts: BlogPostOption[]
}

export interface AdminAuthorWithCount extends BlogAuthorItem {
  _count?: { posts: number }
}

export interface EditingTagState {
  id: number
  tag: string
}

export interface ImageUploadFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
}

export interface PaginationBarProps {
  pagination: PaginationMeta
  page: number
  limit: number
  setPage: (page: number) => void
}

export interface ListBlogParams {
  page: number
  limit: number
  search?: string
}

export interface UploadImageApiResponse {
  status: string
  message?: string
  data?: { id?: string | number }
}

export interface AdminBlogApiResponse<T = unknown> {
  status: string
  message?: string
  data: T
  pagination?: PaginationMeta
}
