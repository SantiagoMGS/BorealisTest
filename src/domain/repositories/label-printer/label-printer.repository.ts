import {
  PrinterConfigDto,
  PrintLabelDto,
} from '@presentation/controllers/label-printer/dtos/printer';

export interface ILabelPrinterRepository {
  /**
   * Imprime etiquetas para una recepción
   */
  printReceptionLabel(data: {
    sampleId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
  }): Promise<{ success: boolean; message: string }>;

  /**
   * Verifica la conexión con una impresora
   */
  testConnection(config?: Partial<PrinterConfigDto>): Promise<boolean>;

  /**
   * Obtiene la configuración de una impresora por su nombre
   */
  getPrinterByName(printerName: string): Promise<PrinterConfigDto | undefined>;
}
