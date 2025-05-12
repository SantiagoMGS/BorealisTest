import { Injectable } from '@nestjs/common';
import { IPaginatedData } from '@shared/interfaces/pagination.interfaces';
import { DoreManagementRepository } from '@domain/repositories/management/dore-management.repository';
import { IManagementFilter } from '@domain/interfaces/management';
import { IDoreManagementResponse } from '@domain/interfaces/management/dore-management.interface';

@Injectable()
export class FindDoreReceptionsByFiltersUseCase {
  constructor(
    private readonly doreManagementRepository: DoreManagementRepository,
  ) {}

  /**
   * Ejecuta la búsqueda de recepciones de doré con filtros y paginación
   * @param filter Filtros y opciones de paginación
   * @returns Datos paginados de recepciones
   */
  async execute(
    filter: IManagementFilter,
  ): Promise<IPaginatedData<IDoreManagementResponse>> {
    return await this.doreManagementRepository.findByFilters(filter);
  }
}
