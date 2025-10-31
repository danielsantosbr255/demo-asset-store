export interface PaginationQueryParams {
	page?: string;
	limit?: string;
}

export interface PaginationInput {
	page: number;
	pageSize: number;
	totalItems: number;
}

export interface PaginationMetadata {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}
