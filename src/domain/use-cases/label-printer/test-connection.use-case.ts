import { Injectable } from '@nestjs/common';
import { PrinterConfigDto } from '@presentation/controllers/label-printer/dtos/printer';
import { LabelPrinterRepositoryImpl } from '@infrastructure/repositories/label-printer/label-printer.repository-impl.service';

@Injectable()
export class TestConnectionUseCase {
  constructor(
    private readonly labelPrinterRepository: LabelPrinterRepositoryImpl,
  ) {}

  async execute(config?: Partial<PrinterConfigDto>): Promise<boolean> {
    return this.labelPrinterRepository.testConnection(config);
  }
}
