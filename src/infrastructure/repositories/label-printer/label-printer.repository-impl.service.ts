import { Injectable, Logger } from '@nestjs/common';
import { ILabelPrinterRepository } from '@domain/repositories/label-printer/label-printer.repository';
import { LabelPrinterService } from '@infrastructure/datasource/printer-label/label-printer.datasource.service';
import { PrinterConfigDto } from '@presentation/controllers/label-printer/dtos/printer';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/company-supplier/company.repository-impl.service';
import { SampleReceptionRepositoryImpl } from '@infrastructure/repositories/reception/sample-reception.repository-impl.service';

@Injectable()
export class LabelPrinterRepositoryImpl implements ILabelPrinterRepository {
  private readonly logger = new Logger(LabelPrinterRepositoryImpl.name);

  constructor(
    private readonly labelPrinterDataSource: LabelPrinterService,
    private readonly companyRepository: CompanyRepositoryImpl,
    private readonly sampleRepository: SampleReceptionRepositoryImpl,
  ) {}

  /**
   * Busca una muestra por su ID
   */
  async findSampleById(sampleId: string): Promise<any | null> {
    return await this.labelPrinterDataSource.findSampleById(sampleId);
  }

  /**
   * Busca una compañía por su ID
   */
  async findCompanyById(companyId: string): Promise<any | null> {
    return await this.labelPrinterDataSource.findCompanyById(companyId);
  }

  /**
   * Obtiene el contador actual de etiquetas para una muestra
   */
  async getCurrentSampleCount(sampleId: string): Promise<number> {
    return await this.labelPrinterDataSource.getCurrentSampleCount(sampleId);
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

  /**
   * Registra la impresión en la base de datos
   */
  async saveTrace(
    sampleId: string,
    printerName: string,
    count: number,
  ): Promise<{ success: boolean; message: string }> {
    return await this.labelPrinterDataSource.saveTrace(
      sampleId,
      printerName,
      count,
    );
  }
}
