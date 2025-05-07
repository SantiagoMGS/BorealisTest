import {
  PrinterConfigDto,
  PrintLabelDto,
} from '@presentation/controllers/label-printer/dtos/printer';

export interface ILabelPrinterRepository {
  /**
   * Busca una muestra por su ID
   */
  findSampleById(sampleId: string): Promise<any | null>;

  /**
   * Busca una compañía por su ID
   */
  findCompanyById(companyId: string): Promise<any | null>;

  /**
   * Obtiene el contador actual de etiquetas para una muestra
   */
  getCurrentSampleCount(sampleId: string): Promise<number>;

  /**
   * Imprime etiquetas para una recepción
   */
  printReceptionLabel(data: {
    sampleId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
    companyId: string;
  }): Promise<{ success: boolean; message: string }>;

  /**
   * Verifica la conexión con una impresora
   */
  testConnection(config?: Partial<PrinterConfigDto>): Promise<boolean>;

  /**
   * Obtiene la configuración de una impresora por su nombre
   */
  getPrinterByName(printerName: string): Promise<PrinterConfigDto | undefined>;

  /**
   * Registra la impresión en la base de datos
   */
  saveTrace(
    sampleId: string,
    printerName: string,
    count: number,
  ): Promise<{ success: boolean; message: string }>;
}
