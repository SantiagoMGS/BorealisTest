import { Injectable } from '@nestjs/common';
import { PrintReceptionLabelDto } from '@presentation/controllers/label-printer/dtos/printer';
import { LabelPrinterRepositoryImpl } from '@infrastructure/repositories/label-printer/label-printer.repository-impl.service';
import { IAuthUser } from '@domain/entities/auth';

@Injectable()
export class PrintReceptionLabelUseCase {
  constructor(
    private readonly labelPrinterRepository: LabelPrinterRepositoryImpl,
  ) {}

  /**
   * Ejecuta el caso de uso para imprimir etiquetas de recepción
   * @param dto Datos para la impresión
   * @returns Resultado de la operación
   */
  async execute(
    dto: PrintReceptionLabelDto,
    user: IAuthUser,
  ): Promise<{ success: boolean; message: string }> {
    return await this.labelPrinterRepository.printReceptionLabel({
      receptionId: dto.receptionId,
      count: dto.count,
      printerName: dto.printerName,
      skipConnectionTest: dto.skipConnectionTest,
      companyId: user.companyId!,
    });
  }
}
