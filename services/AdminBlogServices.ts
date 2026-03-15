import type {
  AdminBlogApiResponse,
  AdminBlogDetail,
  AdminBlogListItem,
  AdminBlogRefData,
  AdminAuthorWithCount,
  BlogAuthorFormData,
  BlogPostFormData,
  BlogTagFormData,
  ListBlogParams,
  UploadImageApiResponse,
} from "@/types/AdminBlogTypes"

const API = "/api/blog/admin"
const IMG_API = "/api/img"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, init)
  return res.json() as Promise<T>
}

async function requestJson<T>(path: string, method: "POST" | "PUT", body: unknown): Promise<T> {
  return request<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function toQuery({ page, limit, search }: ListBlogParams): string {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) params.set("search", search)
  return params.toString()
}

export async function getBlogPosts(params: ListBlogParams): Promise<AdminBlogApiResponse<AdminBlogListItem[]>> {
  return request<AdminBlogApiResponse<AdminBlogListItem[]>>(`/?${toQuery(params)}`)
}

export async function getBlogRefs(): Promise<AdminBlogApiResponse<AdminBlogRefData>> {
  return request<AdminBlogApiResponse<AdminBlogRefData>>("/ref")
}

export async function getBlogDetail(id: number): Promise<AdminBlogApiResponse<AdminBlogDetail>> {
  return request<AdminBlogApiResponse<AdminBlogDetail>>(`/detail?_id=${id}`)
}

export async function createBlogPost(payload: BlogPostFormData): Promise<AdminBlogApiResponse> {
  return requestJson<AdminBlogApiResponse>("/", "POST", payload)
}

export async function updateBlogPost(id: number, payload: BlogPostFormData): Promise<AdminBlogApiResponse> {
  return requestJson<AdminBlogApiResponse>(`/?_id=${id}`, "PUT", payload)
}

export async function deleteBlogPost(id: number): Promise<AdminBlogApiResponse> {
  return request<AdminBlogApiResponse>(`/?_id=${id}`, { method: "DELETE" })
}

export async function createBlogTag(postId: number, payload: BlogTagFormData): Promise<AdminBlogApiResponse> {
  return requestJson<AdminBlogApiResponse>("/tags", "POST", { ...payload, postId })
}

export async function updateBlogTag(id: number, payload: BlogTagFormData): Promise<AdminBlogApiResponse> {
  return requestJson<AdminBlogApiResponse>(`/tags?_id=${id}`, "PUT", payload)
}

export async function deleteBlogTag(id: number): Promise<AdminBlogApiResponse> {
  return request<AdminBlogApiResponse>(`/tags?_id=${id}`, { method: "DELETE" })
}

export async function saveBlogRelatedPosts(postId: number, relatedPostIds: number[]): Promise<AdminBlogApiResponse> {
  return requestJson<AdminBlogApiResponse>("/related", "POST", { postId, relatedPostIds })
}

export async function getBlogAuthors(params: ListBlogParams): Promise<AdminBlogApiResponse<AdminAuthorWithCount[]>> {
  return request<AdminBlogApiResponse<AdminAuthorWithCount[]>>(`/authors?${toQuery(params)}`)
}

export async function createBlogAuthor(payload: BlogAuthorFormData): Promise<AdminBlogApiResponse> {
  return requestJson<AdminBlogApiResponse>("/authors", "POST", payload)
}

export async function updateBlogAuthor(id: number, payload: BlogAuthorFormData): Promise<AdminBlogApiResponse> {
  return requestJson<AdminBlogApiResponse>(`/authors?_id=${id}`, "PUT", payload)
}

export async function deleteBlogAuthor(id: number): Promise<AdminBlogApiResponse> {
  return request<AdminBlogApiResponse>(`/authors?_id=${id}`, { method: "DELETE" })
}

export async function uploadBlogImage(file: File): Promise<{ url: string | null; message?: string }> {
  const formData = new FormData()
  formData.append("files", file)
  const res = await fetch(IMG_API, { method: "POST", body: formData })
  const json = (await res.json()) as UploadImageApiResponse
  if (json.status === "success" && json.data?.id) {
    return { url: `${IMG_API}?_id=${json.data.id}` }
  }
  return { url: null, message: json.message || "Upload gagal" }
}
