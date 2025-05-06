import { Injectable } from '@nestjs/common';
import { ILabelPrinterRepository } from '@domain/repositories/label-printer/label-printer.repository';
import { LabelPrinterService } from '@infrastructure/datasource/printer-label/label-printer.datasource.service';
import { PrinterConfigDto } from '@presentation/controllers/label-printer/dtos/printer';

@Injectable()
export class LabelPrinterRepositoryImpl implements ILabelPrinterRepository {
  constructor(private readonly labelPrinterDataSource: LabelPrinterService) {}

  /**
   * Imprime etiquetas para una recepción
   */
  async printReceptionLabel(data: {
    sampleId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
    companyId: string;
  }): Promise<{ success: boolean; message: string }> {
    return await this.labelPrinterDataSource.printReceptionLabel(data);
  }

  /**
   * Verifica la conexión con una impresora
   */
  async testConnection(config?: Partial<PrinterConfigDto>): Promise<boolean> {
    return await this.labelPrinterDataSource.testConnection(config);
  }

  /**
   * Obtiene la configuración de una impresora por su nombre
   */
  async getPrinterByName(
    printerName: string,
  ): Promise<PrinterConfigDto | undefined> {
    return await this.labelPrinterDataSource.getPrinterByName(printerName);
  }
}
