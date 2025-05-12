import { IDropdownData } from '@domain/interfaces/management/sample-management.interface';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetSampleDropdownDataUseCase {
  constructor(
    private readonly sampleReceptionRepository: SampleManagementRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param startDate Fecha inicial para filtrar
   * @param endDate Fecha final para filtrar
   * @returns Datos para poblar los dropdowns en la UI
   */
  async execute(startDate: Date, endDate: Date): Promise<IDropdownData> {
    return await this.sampleReceptionRepository.getDropdownData(
      startDate,
      endDate,
    );
  }
}
