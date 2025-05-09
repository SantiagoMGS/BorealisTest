import { Injectable, Inject } from '@nestjs/common';
import {
  DoreReceptionRepository,
  IDoreDropdownData,
} from '@domain/repositories/reception/dore-reception.repository';

@Injectable()
export class GetDoreDropdownDataUseCase {
  constructor(
    @Inject('DoreReceptionRepository')
    private readonly doreReceptionRepository: DoreReceptionRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param startDate Fecha inicial para filtrar
   * @param endDate Fecha final para filtrar
   * @returns Datos para poblar los dropdowns en la UI
   */
  async execute(startDate: Date, endDate: Date): Promise<IDoreDropdownData> {
    return await this.doreReceptionRepository.getDropdownData(
      startDate,
      endDate,
    );
  }
}
