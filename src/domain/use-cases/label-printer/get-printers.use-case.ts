import { Injectable, Logger } from '@nestjs/common';
import { LabelPrinterRepositoryImpl } from '@infrastructure/repositories/label-printer/label-printer.repository-impl.service';
import { IAuthUser } from '@domain/entities/auth';

@Injectable()
export class GetPrintersUseCase {
  private readonly logger = new Logger(GetPrintersUseCase.name);

  constructor(
    private readonly labelPrinterRepository: LabelPrinterRepositoryImpl,
  ) {}

  /**
   * Ejecuta el caso de uso para obtener las impresoras disponibles
   * @param user Usuario autenticado con información de compañía
   * @returns Lista de impresoras disponibles
   */
  async execute(user: IAuthUser): Promise<any[]> {
    try {
      this.logger.log(`Obteniendo impresoras para compañía: ${user.companyId}`);

      // Obtener impresoras filtradas por compañía
      const printers = await this.labelPrinterRepository.getPrinters(
        user.companyId!,
      );

      return printers;
    } catch (error: any) {
      this.logger.error(`Error al obtener impresoras: ${error.message}`);
      throw error;
    }
  }
}
