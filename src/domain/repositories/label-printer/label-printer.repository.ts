import { PrinterConfigDto } from '@presentation/controllers/label-printer/dtos/printer';

export interface ILabelPrinterRepository {
  findSampleById(sampleId: string): Promise<any | null>;

  findCompanyById(companyId: string): Promise<any | null>;

  getCurrentSampleCount(sampleId: string): Promise<number>;

  printReceptionLabel(data: {
    sampleId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
    companyId: string;
  }): Promise<{ success: boolean; message: string }>;

  testConnection(config?: Partial<PrinterConfigDto>): Promise<boolean>;

  getPrinterByName(printerName: string): Promise<PrinterConfigDto | undefined>;

  saveTrace(
    sampleId: string,
    printerName: string,
    count: number,
  ): Promise<{ success: boolean; message: string }>;

  getPrinters(companyId: string): Promise<any[]>;
}
