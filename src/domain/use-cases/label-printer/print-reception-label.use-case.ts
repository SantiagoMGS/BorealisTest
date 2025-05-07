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

  /**
   * Ejecuta el caso de uso para imprimir etiquetas de recepción
   * @param dto Datos para la impresión
   * @returns Resultado de la operación
   */
  async execute(
    dto: PrintReceptionLabelDto,
    user: IAuthUser,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar que la compañía existe
      const company = await this.companyDataSource.findById(user.companyId!);

      // Verificar que la muestra existe
      const sample = await this.sampleReceptionDataSource.findSampleById(
        dto.sampleId,
      );

      // 3. Verificar la impresora si se proporciona
      if (dto.printerName) {
        const printerConfig =
          await this.labelPrinterRepository.getPrinterByName(dto.printerName);
        if (!printerConfig) {
          return {
            success: false,
            message: 'Impresora no encontrada',
          };
        }

        // Probar conexión si es necesario
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

      // 4. Solicitar la impresión al repositorio
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

      // 5. Retornar resultado
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
