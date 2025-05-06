import { Injectable } from '@nestjs/common';
import { PrinterConfigDto } from '@presentation/controllers/label-printer/dtos/printer';
import { LabelPrinterRepositoryImpl } from '@infrastructure/repositories/label-printer/label-printer.repository-impl.service';

@Injectable()
export class TestConnectionUseCase {
  constructor(
    private readonly labelPrinterRepository: LabelPrinterRepositoryImpl,
  ) {}

  /**
   * Ejecuta el caso de uso para probar la conexión con la impresora
   * @param config Configuración opcional de la impresora
   * @returns true si la conexión es exitosa, false en caso contrario
   */
  async execute(config?: Partial<PrinterConfigDto>): Promise<boolean> {
    return await this.labelPrinterRepository.testConnection(config);
  }
}
