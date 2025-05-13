import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrintReceptionLabelDto } from '@presentation/controllers/label-printer/dtos/printer';
import { LabelPrinterRepositoryImpl } from '@infrastructure/repositories/label-printer/label-printer.repository-impl.service';
import { IAuthUser } from '@domain/entities/auth';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company';

@Injectable()
export class PrintReceptionLabelUseCase {
  private readonly logger = new Logger(PrintReceptionLabelUseCase.name);

  constructor(
    private readonly labelPrinterRepository: LabelPrinterRepositoryImpl,
    private readonly sampleReceptionDataSource: SampleReceptionDataSourceService,
    private readonly companyDataSource: CompanyDataSourceService,
  ) {}

  async execute(
    dto: PrintReceptionLabelDto,
    user: IAuthUser,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const company = await this.companyDataSource.findById(user.companyId!);

      const sample = await this.sampleReceptionDataSource.findSampleById(
        dto.sampleId,
      );

      if (dto.printerName) {
        const printerConfig =
          await this.labelPrinterRepository.getPrinterByName(dto.printerName);
        if (!printerConfig) {
          return {
            success: false,
            message: 'Impresora no encontrada',
          };
        }

        if (!dto.skipConnectionTest) {
          const isConnected =
            await this.labelPrinterRepository.testConnection(printerConfig);
          if (!isConnected) {
            this.logger.warn(
              `No se pudo conectar con la impresora: ${dto.printerName}`,
            );
            return {
              success: false,
              message: 'No se pudo establecer conexión con la impresora',
            };
          }
        }
      }

      const printResult = await this.labelPrinterRepository.printReceptionLabel(
        {
          sampleId: dto.sampleId,
          count: dto.count,
          printerName: dto.printerName,
          skipConnectionTest: dto.skipConnectionTest,
          companyId: user.companyId!,
          companyName: company.name,
        },
      );

      return printResult;
    } catch (error: any) {
      this.logger.error(`Error en caso de uso de impresión: ${error.message}`);

      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: error.message,
        };
      }

      if (error instanceof BadRequestException) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: false,
        message: 'Error al procesar la solicitud de impresión',
      };
    }
  }
}
