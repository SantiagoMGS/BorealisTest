import { Injectable } from '@nestjs/common';
import {
  DoreReceptionRepository,
  IDoreReceptionFilter,
} from '@domain/repositories/reception';
import { IPaginatedData } from '@shared/interfaces/pagination.interfaces';
import { IDoreReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class FindDoreReceptionsByFiltersUseCase {
  constructor(
    private readonly doreReceptionRepository: DoreReceptionRepository,
  ) {}

  /**
   * Ejecuta la búsqueda de recepciones de doré con filtros y paginación
   * @param filter Filtros y opciones de paginación
   * @returns Datos paginados de recepciones
   */
  async execute(
    filter: IDoreReceptionFilter,
  ): Promise<IPaginatedData<IDoreReceptionResponse>> {
    return await this.doreReceptionRepository.findByFilters(filter);
  }
}
