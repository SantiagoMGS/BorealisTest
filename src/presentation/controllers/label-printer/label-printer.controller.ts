import {
  Controller,
  Post,
  Body,
  Get,
  Logger,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  PrinterConfigDto,
  PrintReceptionLabelDto,
} from '@presentation/controllers/label-printer/dtos/printer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { PrintReceptionLabelUseCase } from '@domain/use-cases/label-printer/print-reception-label.use-case';
import { TestConnectionUseCase } from '@domain/use-cases/label-printer/test-connection.use-case';
import { GetPrintersUseCase } from '@domain/use-cases/label-printer/get-printers.use-case';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { RequirePermission } from '@core/decorators/require-permission.decorator';
import { PermissionsGuard } from '@infrastructure/guards/permissions.guard';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { IAuthUser } from '@domain/entities/auth';

@ApiTags('Impresora de Etiquetas')
@ApiBearerAuth()
@Controller('printer')
@UseInterceptors(ResponseInterceptor)
@RequirePermission(LabelPrinterController.name)
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LabelPrinterController {
  private readonly logger = new Logger(LabelPrinterController.name);

  constructor(
    private readonly printReceptionLabelUseCase: PrintReceptionLabelUseCase,
    private readonly testConnectionUseCase: TestConnectionUseCase,
    private readonly getPrintersUseCase: GetPrintersUseCase,
  ) {}

  /**
   * Obtener todas las impresoras disponibles
   */
  @ApiOperation({ summary: 'Obtener todas las impresoras disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de impresoras disponibles',
  })
  @CustomResponse({
    successMessage: 'Impresoras obtenidas correctamente',
    errorMessage: 'Error al obtener las impresoras',
  })
  @Get()
  async getPrinters(@CurrentUser() user: IAuthUser) {
    try {
      this.logger.log(
        `Solicitando lista de impresoras para compañía: ${user.companyId}`,
      );

      const printers = await this.getPrintersUseCase.execute(user);

      return {
        success: true,
        data: printers,
        message: 'Impresoras obtenidas correctamente',
      };
    } catch (error: any) {
      this.logger.error(`Error al obtener impresoras: ${error.message}`);
      throw new HttpException(
        'Error al obtener las impresoras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
      const result = await this.testConnectionUseCase.execute(datos);

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
   * Imprimir etiqueta de recepción con código QR
   */
  @ApiOperation({ summary: 'Imprimir etiqueta de recepción con código QR' })
  @ApiResponse({
    status: 200,
    description: 'Etiqueta impresa correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Muestra no encontrada',
  })
  @CustomResponse({
    successMessage: 'Etiqueta impresa correctamente',
    errorMessage: 'Error durante la impresión de la etiqueta',
  })
  @Post('print-qr')
  async printQR(
    @Body() printReceptionLabelDto: PrintReceptionLabelDto,
    @CurrentUser() user: IAuthUser,
  ) {
    try {
      this.logger.log(
        `Solicitud de impresión recibida para muestra: ${printReceptionLabelDto.sampleId}`,
      );

      const result = await this.printReceptionLabelUseCase.execute(
        printReceptionLabelDto,
        user,
      );

      if (!result.success) {
        this.logger.warn(`Error en impresión: ${result.message}`);

        // Determinar el código de estado según el mensaje de error
        if (result.message === 'Muestra no encontrada') {
          throw new HttpException(result.message, HttpStatus.NOT_FOUND);
        }

        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error: any) {
      this.logger.error(
        `Error al imprimir etiqueta: ${error instanceof Error ? error.message : String(error)}`,
      );

      // Si ya es un HttpException, relanzarlo
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error instanceof Error
          ? error.message
          : 'Error inesperado durante la impresión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
