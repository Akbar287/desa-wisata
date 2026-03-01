export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
    status: 'success' | 'error';
    message: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 10;
