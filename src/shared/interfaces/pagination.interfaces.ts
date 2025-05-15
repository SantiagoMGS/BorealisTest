export interface IPaginationOptions {
  page: number;
  limit: number;
  withDeleted?: boolean;
}

export interface IPaginatedData<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
