import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  PrinterConfigDto,
  PrintLabelDto,
} from '@presentation/controllers/label-printer/dtos/printer';
import * as net from 'net';

// Interfaces para definir tipos de datos y resultados
interface PrinterConfig {
  ip: string;
  port: number;
  timeout: number;
}

interface PrintResult {
  success: boolean;
  message: string;
}

interface CompanyInfo {
  id: string;
  name: string;
}

@Injectable()
export class LabelPrinterService {
  private readonly logger = new Logger(LabelPrinterService.name);

  // Configuración por defecto de la impresora
  private readonly printerConfig: PrinterConfig = {
    ip: '192.168.1.123',
    port: 9100,
    timeout: 8000,
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Imprime etiquetas de recepción
   * @param data Datos para la impresión (ID de muestra, cantidad, configuración)
   * @returns Resultado de la operación
   */
  async printReceptionLabel(data: {
    sampleId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
    companyId: string;
  }): Promise<PrintResult> {
    try {
      this.logger.log(`Iniciando impresión para muestra: ${data.sampleId}`);

      // 1. Validar datos de entrada
      if (!data.sampleId) {
        this.logger.warn('No se proporcionó el ID de muestra');
        return {
          success: false,
          message: 'El ID de muestra es requerido para la impresión',
        };
      }

      if (!data.companyId) {
        this.logger.warn('No se proporcionó el ID de la compañía');
        return {
          success: false,
          message: 'El ID de la compañía es requerido para la impresión',
        };
      }

      // 2. Verificar que la muestra existe
      let sample;
      try {
        sample = await this.prisma.sample.findUnique({
          where: { id: data.sampleId },
          select: { id: true },
        });
      } catch (error: any) {
        // Capturar errores de base de datos
        this.logger.warn(`Error al buscar muestra: ${error.message}`);
        return {
          success: false,
          message: 'Muestra no encontrada',
        };
      }

      if (!sample) {
        this.logger.warn(`Muestra no encontrada: ${data.sampleId}`);
        return {
          success: false,
          message: 'Muestra no encontrada',
        };
      }

      // 3. Obtener información de la compañía
      let company;
      try {
        company = await this.getCompanyInfo(data.companyId);
      } catch (error: any) {
        this.logger.warn(
          `Error al obtener información de la compañía: ${error.message}`,
        );
        return {
          success: false,
          message: `No se pudo obtener la información de la compañía`,
        };
      }

      // 4. Obtener configuración de la impresora
      let printerConfig;
      if (data.printerName) {
        printerConfig = await this.getPrinterConfig(data.printerName);
        if (!printerConfig) {
          this.logger.warn(`No se encontró la impresora: ${data.printerName}`);
          return {
            success: false,
            message: `No se pudo encontrar la impresora especificada`,
          };
        }
      }

      // 5. Verificar conexión si es necesario
      if (!data.skipConnectionTest) {
        try {
          const connected = await this.testConnection(printerConfig);
          if (!connected) {
            return {
              success: false,
              message: 'No se pudo establecer conexión con la impresora',
            };
          }
        } catch (error: any) {
          this.logger.error(`Error al probar conexión: ${error.message}`);
          return {
            success: false,
            message: 'Error al verificar conexión con la impresora',
          };
        }
      }

      // 6. Preparar datos para la impresión
      const printData = this.preparePrintData(
        data.sampleId,
        data.skipConnectionTest,
        printerConfig,
      );

      // 7. Imprimir las etiquetas
      try {
        await this.printAllLabels(
          printData,
          company.name,
          printerConfig,
          data.count,
        );
      } catch (error: any) {
        this.logger.error(`Error al imprimir etiquetas: ${error.message}`);
        return {
          success: false,
          message: `Error durante la impresión: ${error.message}`,
        };
      }

      // 8. Registrar impresión en la base de datos si se proporcionó nombre de impresora
      if (data.printerName) {
        try {
          const traceResult = await this.saveTrace(
            data.sampleId,
            data.printerName,
            data.count,
          );
          if (!traceResult.success) {
            this.logger.warn(
              `No se pudo registrar la traza: ${traceResult.message}`,
            );
            // No retornamos error por esto, continuamos con el flujo
          }
        } catch (error: any) {
          this.logger.warn(`Error al registrar traza: ${error.message}`);
          // No retornamos error, solo registramos la advertencia
        }
      }

      this.logger.log('Impresión completada exitosamente');
      return {
        success: true,
        message: `Se imprimieron ${data.count} etiqueta(s) correctamente`,
      };
    } catch (error: any) {
      this.logger.error(
        `Error inesperado al imprimir etiqueta: ${error.message}`,
      );
      return {
        success: false,
        message: `Error en el proceso de impresión`,
      };
    }
  }

  /**
   * Obtiene el contador actual para un sampleId determinado
   */
  private async getCurrentSampleCount(
    sampleId: string | undefined,
  ): Promise<number> {
    try {
      if (!sampleId) {
        return 0;
      }

      // Contar cuántas etiquetas se han impreso para esta muestra
      const count = await this.prisma.samplePrinterTrace.aggregate({
        where: { sampleId: sampleId },
        _sum: { count: true },
      });

      return count._sum.count || 0;
    } catch (error: any) {
      this.logger.error(
        `Error al obtener contador de muestra: ${error.message}`,
      );
      return 0;
    }
  }

  /**
   * Obtiene la información de la compañía
   */
  private async getCompanyInfo(companyId: string): Promise<CompanyInfo> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        select: { id: true, name: true },
      });

      if (!company) {
        this.logger.warn(`Compañía no encontrada: ${companyId}`);
        throw new HttpException(`Compañía no encontrada`, HttpStatus.NOT_FOUND);
      }

      return company;
    } catch (error: any) {
      // Si el error es por un formato de UUID inválido, dar un mensaje amigable
      this.logger.error(`Error al obtener compañía: ${error.message}`);

      // Si ya es una HttpException, relanzarla
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(`Compañía no encontrada`, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Obtiene la configuración de la impresora
   */
  private async getPrinterConfig(
    printerName?: string,
  ): Promise<PrinterConfigDto | undefined> {
    if (!printerName) return undefined;

    const printerConfig = await this.getPrinterByName(printerName);
    if (!printerConfig) {
      this.logger.warn(`Impresora no encontrada: ${printerName}`);
      throw new Error(`Impresora "${printerName}" no encontrada.`);
    }

    return printerConfig;
  }

  /**
   * Verifica la conexión con la impresora
   */
  private async verifyPrinterConnection(
    printerConfig?: PrinterConfigDto,
  ): Promise<void> {
    const conexion = await this.testConnection(printerConfig);
    if (!conexion) {
      throw new Error('No se pudo establecer conexión con la impresora');
    }
  }

  /**
   * Prepara los datos para la impresión
   */
  private preparePrintData(
    sampleId: string,
    skipConnectionTest?: boolean,
    printerConfig?: PrinterConfigDto,
  ): PrintLabelDto {
    this.logger.log(`Preparando impresión para muestra: ${sampleId}`);

    const printData: PrintLabelDto = {
      qrCode: sampleId,
      skipConnectionTest: skipConnectionTest,
    };

    if (printerConfig) {
      printData.printerConfig = printerConfig;
    }

    return printData;
  }

  /**
   * Imprime todas las etiquetas solicitadas
   */
  private async printAllLabels(
    printData: PrintLabelDto,
    companyName: string,
    printerConfig?: PrinterConfigDto,
    count: number = 1,
  ): Promise<void> {
    this.logger.log(`Iniciando impresión de ${count} etiqueta(s)`);

    // Obtener el contador actual para este sampleId
    const baseCount = await this.getCurrentSampleCount(printData.qrCode);

    for (let i = 0; i < count; i++) {
      const currentCount = baseCount + i + 1;
      await this.printLabel(
        printData,
        companyName,
        printerConfig,
        currentCount,
      );
    }
  }

  /**
   * Obtiene la configuración de una impresora por su nombre
   * @param printerName Nombre de la impresora
   * @returns Configuración de la impresora
   */
  async getPrinterByName(
    printerName: string,
  ): Promise<PrinterConfigDto | undefined> {
    try {
      this.logger.log(`Buscando impresora con nombre: ${printerName}`);

      // Buscar la impresora en la base de datos
      const printer = await this.prisma.printer.findFirst({
        where: {
          printerName: printerName,
          isActive: true,
        },
      });

      if (!printer) {
        this.logger.warn(`No se encontró la impresora: ${printerName}`);
        return undefined;
      }

      // Mapear los datos de la base de datos al DTO
      const printerConfig: PrinterConfigDto = {
        ip: printer.ip,
        port: parseInt(printer.port, 10),
        timeout: 8000,
      };

      this.logger.log(`Impresora encontrada: ${printer.ip}:${printer.port}`);
      return printerConfig;
    } catch (error: any) {
      this.logger.error(`Error al buscar impresora: ${error.message}`);
      return undefined;
    }
  }

  /**
   * Verifica la conexión con la impresora
   * @param config Configuración opcional para la prueba
   * @returns {Promise<boolean>} true si la conexión es exitosa, false en caso contrario
   */
  async testConnection(config?: Partial<PrinterConfigDto>): Promise<boolean> {
    const testConfig = config
      ? { ...this.printerConfig, ...config }
      : this.printerConfig;

    const client = new net.Socket();

    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        client.destroy();
        this.logger.warn(
          `No se pudo conectar a la impresora en ${testConfig.ip}:${testConfig.port}`,
        );
        resolve(false);
      }, testConfig.timeout);

      client.connect(testConfig.port, testConfig.ip, () => {
        clearTimeout(timeout);
        this.logger.log(
          `Conexión exitosa con la impresora ${testConfig.ip}:${testConfig.port}`,
        );
        client.destroy();
        resolve(true);
      });

      client.on('error', (err) => {
        clearTimeout(timeout);
        this.logger.error(`Error de conexión: ${err.message}`);
        client.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Registra la impresión de una muestra en la base de datos
   * @param sampleId ID de la muestra
   * @param printerName Nombre de la impresora
   * @param count Cantidad de etiquetas impresas
   * @returns Resultado de la operación
   */
  async saveTrace(
    sampleId: string,
    printerName: string,
    count: number,
  ): Promise<PrintResult> {
    try {
      // Verificar que la muestra existe
      let sample;
      try {
        sample = await this.prisma.sample.findUnique({
          where: { id: sampleId },
          select: { id: true },
        });
      } catch (error: any) {
        // Capturar errores de base de datos
        this.logger.warn(`Error al buscar muestra: ${error.message}`);
        return {
          success: false,
          message: 'Muestra no encontrada',
        };
      }

      if (!sample) {
        this.logger.warn(`No se encontró la muestra con ID: ${sampleId}`);
        return {
          success: false,
          message: 'Muestra no encontrada',
        };
      }

      // Obtener el ID de la impresora
      const printer = await this.prisma.printer.findFirst({
        where: {
          printerName: printerName,
          isActive: true,
        },
        select: { id: true },
      });

      if (!printer) {
        this.logger.warn(
          `No se pudo obtener el ID de la impresora ${printerName}`,
        );
        return {
          success: false,
          message: `No se pudo encontrar la impresora especificada`,
        };
      }

      // Registrar la impresión
      await this.prisma.samplePrinterTrace.create({
        data: {
          sampleId: sample.id,
          printerId: printer.id,
          count,
        },
      });

      this.logger.log(`Impresión registrada correctamente`);
      return {
        success: true,
        message: `Traza de impresión registrada correctamente`,
      };
    } catch (error: any) {
      this.logger.error(`Error al registrar impresión: ${error.message}`);
      return {
        success: false,
        message: `Error al registrar la traza de impresión`,
      };
    }
  }

  /**
   * Imprime una etiqueta con información de QR
   * @param data Datos para la etiqueta (QR y configuración)
   * @param companyName Nombre de la compañía
   * @param config Configuración opcional para la impresora
   * @param sequenceNumber Número secuencial de la etiqueta
   */
  async printLabel(
    data: Partial<PrintLabelDto>,
    companyName: string,
    config?: Partial<PrinterConfigDto>,
    sequenceNumber?: number,
  ): Promise<void> {
    // Configuración de la etiqueta ZPL para tamaño 50x25mm
    const commands: string[] = [
      '^XA', // Inicio de etiqueta
      '^PW380', // Ancho de impresión reducido: ~47.5mm (380 dots @ 203dpi)
      '^LL180', // Largo de etiqueta reducido: ~22.5mm (180 dots @ 203dpi)
      '^CF0,16,16', // Fuente predeterminada más pequeña
      '^FO5,5^GB370,170,2^FS', // Marco exterior para toda la etiqueta (margen de 5 puntos)
    ];

    // Encabezado con el nombre de la compañía
    commands.push('^FO25,20^A0N,18,18^FD' + companyName + '^FS');
    commands.push('^FO15,40^GB350,2,2^FS'); // Línea separadora

    // QR Code más pequeño y ajustado al espacio disponible
    if (data.qrCode) {
      commands.push('^FO260,55^BQN,2,3^FDMA,' + data.qrCode + '^FS'); // QR con tamaño original
    }

    // Mostrar contador de impresión
    if (sequenceNumber) {
      commands.push('^FO25,70^A0N,16,16^FDEtiqueta: ' + sequenceNumber + '^FS');
    }

    commands.push('^FO25,90^A0N,16,16^FD' + 'Fecha de Recepción:' + '^FS');

    // Fecha y hora en formato compacto
    const now = new Date();
    const dateString = now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeString = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    commands.push(
      '^FO25,110^A0N,16,16^FD' + dateString + ' ' + timeString + '^FS',
    );

    // Finalizar etiqueta
    commands.push('^XZ');

    const zplCommand = commands.join('\r\n');

    // Enviar comandos a la impresora
    try {
      await this.sendToPrinter(Buffer.from(zplCommand, 'ascii'), config);
    } catch (err: any) {
      this.logger.error(`Error al imprimir etiqueta: ${err.message}`);
      throw err;
    }
  }

  /**
   * Envía datos a la impresora
   * @param commandBuffer Buffer con comandos a enviar
   * @param config Configuración opcional de impresora
   * @private
   */
  private async sendToPrinter(
    commandBuffer: Buffer,
    config?: Partial<PrinterConfigDto>,
  ): Promise<void> {
    const printConfig = config
      ? { ...this.printerConfig, ...config }
      : this.printerConfig;

    const client = new net.Socket();
    client.setKeepAlive(true);
    client.setTimeout(printConfig.timeout || 8000);

    return new Promise((resolve, reject) => {
      let isHandled = false;

      const handleEnd = (success: boolean, error?: Error) => {
        if (isHandled) return;
        isHandled = true;

        try {
          client.destroy();
        } catch (e: any) {
          this.logger.warn(`Error al cerrar el socket: ${e.message}`);
        }

        if (success) {
          resolve();
        } else {
          reject(error);
        }
      };

      // Conectar con timeout
      const timeout = setTimeout(() => {
        this.logger.error(
          `Timeout al conectar con la impresora ${printConfig.ip}:${printConfig.port}`,
        );
        handleEnd(
          false,
          new Error(
            `Timeout al conectar con la impresora ${printConfig.ip}:${printConfig.port}`,
          ),
        );
      }, printConfig.timeout);

      // Evento de conexión
      client.connect(printConfig.port, printConfig.ip, () => {
        this.logger.log(
          `Conectado a la impresora ${printConfig.ip}:${printConfig.port}`,
        );
        clearTimeout(timeout);

        // Enviar datos
        client.write(commandBuffer, (err) => {
          if (err) {
            this.logger.error(`Error al enviar datos: ${err.message}`);
            return handleEnd(false, err);
          }

          this.logger.log(
            `Datos enviados correctamente (${commandBuffer.length} bytes)`,
          );

          // Esperar antes de cerrar conexión
          setTimeout(() => {
            this.logger.log('Cerrando conexión');
            handleEnd(true);
          }, 500);
        });
      });

      // Manejar errores
      client.on('error', (err) => {
        this.logger.error(`Error de socket: ${err.message}`);
        clearTimeout(timeout);
        handleEnd(false, err);
      });

      // Manejar cierre
      client.on('close', (hadError) => {
        if (hadError) {
          this.logger.warn('Conexión cerrada con error');
        }
      });
    });
  }
}
