import { Injectable } from '@nestjs/common';
import { IDoreDropdownData } from '@domain/interfaces/management/dore-management.interface';
import { DoreManagementRepository } from '@domain/repositories/management/dore-management.repository';

@Injectable()
export class GetDoreDropdownDataUseCase {
  constructor(
    private readonly doreManagementRepository: DoreManagementRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param startDate Fecha inicial para filtrar
   * @param endDate Fecha final para filtrar
   * @returns Datos para poblar los dropdowns en la UI
   */
  async execute(startDate: Date, endDate: Date): Promise<IDoreDropdownData> {
    return await this.doreManagementRepository.getDropdownData(
      startDate,
      endDate,
    );
  }
}
