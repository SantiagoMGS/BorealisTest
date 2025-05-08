/**
 * Interfaz base para operaciones de paginación
 */
export interface IPaginationOptions {
  page: number;
  limit: number;
  withDeleted?: boolean;
}

/**
 * Interfaz para el resultado de operaciones paginadas
 */
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
