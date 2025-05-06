import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
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
   * @param data Datos para la impresión (ID recepción, cantidad, configuración)
   * @returns Resultado de la operación
   */
  async printReceptionLabel(data: {
    receptionId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
    companyId: string;
  }): Promise<PrintResult> {
    try {
      this.logger.log(
        `Iniciando impresión para recepción: ${data.receptionId}`,
      );

      // 1. Validar datos de entrada
      this.validatePrintData(data);

      // 2. Obtener información de la compañía
      const company = await this.getCompanyInfo(data.companyId);

      // 3. Obtener configuración de la impresora
      const printerConfig = await this.getPrinterConfig(data.printerName);

      // 4. Verificar conexión si es necesario
      if (!data.skipConnectionTest) {
        await this.verifyPrinterConnection(printerConfig);
      }

      // 5. Preparar datos para la impresión
      const printData = this.preparePrintData(
        data.receptionId,
        data.skipConnectionTest,
        printerConfig,
      );

      // 6. Imprimir las etiquetas
      await this.printAllLabels(
        printData,
        company.name,
        printerConfig,
        data.count,
      );

      // 7. Registrar impresión en la base de datos si se proporcionó nombre de impresora
      if (data.printerName) {
        await this.saveTrace(data.receptionId, data.printerName, data.count);
      }

      this.logger.log('Impresión completada exitosamente');
      return {
        success: true,
        message: `Se imprimieron ${data.count} etiqueta(s) correctamente`,
      };
    } catch (error: any) {
      this.logger.error(`Error al imprimir etiqueta: ${error.message}`);
      throw error;
    }
  }

  /**
   * Valida los datos de impresión
   */
  private validatePrintData(data: {
    receptionId: string;
    companyId: string;
  }): void {
    if (!data.receptionId) {
      throw new Error('El ID de recepción es requerido para la impresión');
    }

    if (!data.companyId) {
      this.logger.warn('No se proporcionó el ID de la compañía');
      throw new Error('El ID de la compañía es requerido para la impresión');
    }
  }

  /**
   * Obtiene la información de la compañía
   */
  private async getCompanyInfo(companyId: string): Promise<CompanyInfo> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true },
    });

    if (!company) {
      this.logger.warn(`Compañía no encontrada con ID: ${companyId}`);
      throw new Error(`La compañía con ID "${companyId}" no existe`);
    }

    this.logger.log(`Compañía validada: ${company.name} (${company.id})`);
    return company;
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
    receptionId: string,
    skipConnectionTest?: boolean,
    printerConfig?: PrinterConfigDto,
  ): PrintLabelDto {
    this.logger.log(`Preparando impresión para recepción: ${receptionId}`);

    const printData: PrintLabelDto = {
      qrCode: receptionId,
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
   * Obtiene el contador actual para un sampleId determinado
   */
  private async getCurrentSampleCount(
    receptionId: string | undefined,
  ): Promise<number> {
    try {
      if (!receptionId) {
        return 0;
      }

      // Buscar la muestra
      const sample = await this.prisma.sample.findFirst({
        where: { receptionId: receptionId },
        select: { id: true },
      });

      if (!sample) {
        return 0;
      }

      // Contar cuántas etiquetas se han impreso para esta muestra
      const count = await this.prisma.samplePrinterTrace.aggregate({
        where: { sampleId: sample.id },
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
   * @param receptionId ID de la recepción
   * @param printerName Nombre de la impresora
   * @param count Cantidad de etiquetas impresas
   */
  async saveTrace(
    receptionId: string,
    printerName: string,
    count: number,
  ): Promise<void> {
    try {
      // Primero buscar la muestra asociada a la recepción
      const sample = await this.prisma.sample.findFirst({
        where: { receptionId: receptionId },
        select: { id: true },
      });

      if (!sample) {
        this.logger.warn(
          `No se encontró muestra para la recepción ${receptionId}`,
        );
        return;
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
        return;
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
    } catch (error: any) {
      this.logger.error(`Error al registrar impresión: ${error.message}`);
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

    // Línea fial

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
