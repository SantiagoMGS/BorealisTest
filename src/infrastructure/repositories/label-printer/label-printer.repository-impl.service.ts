import { Injectable, Logger } from '@nestjs/common';
import { ILabelPrinterRepository } from '@domain/repositories/label-printer/label-printer.repository';
import { LabelPrinterService } from '@infrastructure/datasource/printer-label/label-printer.datasource.service';
import { PrinterConfigDto } from '@presentation/controllers/label-printer/dtos/printer';

@Injectable()
export class LabelPrinterRepositoryImpl implements ILabelPrinterRepository {
  private readonly logger = new Logger(LabelPrinterRepositoryImpl.name);

  constructor(private readonly labelPrinterDataSource: LabelPrinterService) {}

  /**
   * Busca una muestra por su ID
   */
  async findSampleById(sampleId: string): Promise<any | null> {
    return this.labelPrinterDataSource.findSampleById(sampleId);
  }

  /**
   * Busca una compañía por su ID
   */
  async findCompanyById(companyId: string): Promise<any | null> {
    return this.labelPrinterDataSource.findCompanyById(companyId);
  }

  /**
   * Obtiene el contador actual de etiquetas para una muestra
   */
  async getCurrentSampleCount(sampleId: string): Promise<number> {
    return this.labelPrinterDataSource.getCurrentSampleCount(sampleId);
  }

  /**
   * Imprime etiquetas para una recepción
   */
  async printReceptionLabel(data: {
    sampleId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
    companyId: string;
    companyName: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      //  Llamar al datasource para manejar la impresión
      return await this.labelPrinterDataSource.printReceptionLabel({
        ...data,
        companyName: data.companyName,
      });
    } catch (error: any) {
      this.logger.error(
        `Error en el repositorio de impresión: ${error.message}`,
      );
      return {
        success: false,
        message: `Error al procesar la solicitud de impresión: ${error.message}`,
      };
    }
  }

  /**
   * Verifica la conexión con una impresora
   */
  async testConnection(config?: Partial<PrinterConfigDto>): Promise<boolean> {
    return this.labelPrinterDataSource.testConnection(config);
  }

  /**
   * Obtiene la configuración de una impresora por su nombre
   */
  async getPrinterByName(
    printerName: string,
  ): Promise<PrinterConfigDto | undefined> {
    return this.labelPrinterDataSource.getPrinterByName(printerName);
  }

  /**
   * Registra la impresión en la base de datos
   */
  async saveTrace(
    sampleId: string,
    printerName: string,
    count: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.labelPrinterDataSource.saveTrace(sampleId, printerName, count);
  }

  /**
   * Obtiene todas las impresoras disponibles para una compañía
   * @param companyId ID de la compañía
   * @returns Lista de impresoras disponibles
   */
  async getPrinters(companyId: string): Promise<any[]> {
    return this.labelPrinterDataSource.getPrinters(companyId);
  }
}
