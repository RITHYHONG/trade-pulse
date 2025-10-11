export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
}

export interface PaginationMeta {
	total: number;
	page: number;
	perPage: number;
	pageCount: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: ApiError;
	meta?: PaginationMeta;
}