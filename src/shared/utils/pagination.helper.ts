import {
  IPaginatedData,
  IPaginationOptions,
} from '../interfaces/pagination.interfaces';

export class PaginationHelper {
  static createPaginatedResponse<T>(
    data: T[],
    options: IPaginationOptions,
  ): IPaginatedData<T> {
    const { page, limit } = options;
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = data.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static createPaginatedResponseFromItems<T>(
    paginatedItems: T[],
    totalItems: number,
    options: IPaginationOptions,
  ): IPaginatedData<T> {
    const { page, limit } = options;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: paginatedItems,
      meta: {
        page,
        limit,
        total: totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
