import { LabelPrinterService } from '@infrastructure/integrations/label-printer.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Logger,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { PrinterConfigDto, PrintLabelDto } from '@presentation/dtos/printer';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';

@ApiTags('Impresora de Etiquetas')
@Controller('printer')
@UseInterceptors(ResponseInterceptor)
export class LabelPrinterController {
  private readonly logger = new Logger(LabelPrinterController.name);

  constructor(private readonly labelPrinterService: LabelPrinterService) {}

  /**
   * Verificar la conexión con la impresora
   */
  @ApiOperation({ summary: 'Verificar la conexión con la impresora' })
  @ApiResponse({
    status: 200,
    description: 'Estado de la conexión con la impresora',
  })
  @CustomResponse({
    successMessage: 'Conexión exitosa con la impresora',
    errorMessage: 'No se pudo conectar con la impresora',
  })
  @Get('test-connection')
  async testConnection(@Body() datos?: PrinterConfigDto) {
    try {
      const result = await this.labelPrinterService.testConnection(datos);

      if (!result) {
        throw new HttpException(
          'No se pudo conectar con la impresora',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return {
        success: true,
        message: 'Conexión exitosa con la impresora',
      };
    } catch (error: any) {
      this.logger.error(`Error en prueba de conexión: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  /**
   * Imprimir código QR básico
   */
  @ApiOperation({ summary: 'Imprimir código QR básico' })
  @ApiResponse({
    status: 200,
    description: 'Código QR impreso correctamente',
  })
  @CustomResponse({
    successMessage: 'Código QR impreso correctamente',
    errorMessage: 'Error durante la impresión del código QR',
  })
  @Post('print-qr')
  async printQR(@Body() datos: PrintLabelDto) {
    try {
      // Validación básica
      if (!datos.qrCode) {
        throw new HttpException(
          'El contenido del código QR está vacío',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Paso 1: Verificar conexión si no se omite
      if (!datos.skipConnectionTest) {
        const conexion = await this.labelPrinterService.testConnection(
          datos.printerConfig,
        );
        if (!conexion) {
          throw new HttpException(
            'No se pudo establecer conexión con la impresora',
            HttpStatus.BAD_GATEWAY,
          );
        }
      }

      // Paso 2: Imprimir
      this.logger.log(`Enviando a imprimir código QR: '${datos.qrCode}'`);
      await this.labelPrinterService.printLabel(datos, datos.printerConfig);

      this.logger.log('Impresión completada');

      return {
        success: true,
        message: 'Código QR impreso correctamente',
      };
    } catch (error: any) {
      this.logger.error(
        `Error al imprimir QR: ${error instanceof Error ? error.message : String(error)}`,
      );

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
