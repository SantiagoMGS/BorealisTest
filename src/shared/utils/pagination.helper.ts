import {
  IPaginatedData,
  IPaginationOptions,
} from '../interfaces/pagination.interfaces';

/**
 * Clase de utilidad para crear respuestas paginadas
 */
export class PaginationHelper {
  /**
   * Crea un objeto de resultado paginado a partir de un array y opciones de paginación
   * @param data Array con todos los items
   * @param options Opciones de paginación (página, límite)
   * @returns Objeto con la estructura de datos paginados
   */
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

  /**
   * Crea un objeto de resultado paginado cuando ya tenemos los items paginados y el total
   * @param paginatedItems Array con los items ya paginados
   * @param totalItems Total de items sin paginar
   * @param options Opciones de paginación (página, límite)
   * @returns Objeto con la estructura de datos paginados
   */
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
