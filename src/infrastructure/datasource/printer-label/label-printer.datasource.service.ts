import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  PrinterConfigDto,
  PrintLabelDto,
} from '@presentation/controllers/label-printer/dtos/printer';
import * as net from 'net';

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

  private readonly printerConfig: PrinterConfig = {
    ip: '192.168.1.123',
    port: 9100,
    timeout: 8000,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findSampleById(sampleId: string): Promise<any | null> {
    try {
      if (!sampleId) {
        this.logger.error(
          'Error: sampleId es requerido y no puede ser undefined o vacío',
        );
        throw new Error(
          'El ID de muestra es requerido para buscar una muestra',
        );
      }

      return await this.prisma.sample.findUnique({
        where: { id: sampleId },
        select: { id: true },
      });
    } catch (error: any) {
      this.logger.error(`Error al buscar muestra: ${error.message}`);
      throw error;
    }
  }

  async findCompanyById(companyId: string): Promise<CompanyInfo | null> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        select: { id: true, name: true },
      });

      return company;
    } catch (error: any) {
      this.logger.error(`Error al obtener compañía: ${error.message}`);
      return null;
    }
  }

  async getCurrentSampleCount(sampleId: string): Promise<number> {
    try {
      if (!sampleId) {
        this.logger.error(
          'Error: sampleId es requerido y no puede ser undefined o vacío',
        );
        throw new Error('sampleId es requerido para obtener el contador');
      }

      this.logger.log(`Consultando contador para muestra: ${sampleId}`);

      // Contar cuántas etiquetas se han impreso para esta muestra
      const count = await this.prisma.samplePrinterTrace.aggregate({
        where: { sampleId: sampleId },
        _sum: { count: true },
      });

      // Si no hay registros o la suma es null, devolver 0
      const totalCount = count._sum.count || 0;
      this.logger.log(
        `Total acumulado de etiquetas para muestra ${sampleId}: ${totalCount}`,
      );

      return totalCount;
    } catch (error: any) {
      this.logger.error(
        `Error al obtener contador de muestra ${sampleId}: ${error.message}`,
      );
      throw error;
    }
  }

  async saveTrace(
    sampleId: string,
    printerName: string,
    count: number,
  ): Promise<PrintResult> {
    try {
      this.logger.log(
        `Registrando impresión: muestra=${sampleId}, impresora=${printerName}, cantidad=${count}`,
      );

      // Verificar que la muestra existe
      const sample = await this.prisma.sample.findUnique({
        where: { id: sampleId },
        select: { id: true },
      });

      if (!sample) {
        this.logger.warn(
          `No se pudo registrar impresión: muestra ${sampleId} no encontrada`,
        );
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
          `No se pudo registrar impresión: impresora ${printerName} no encontrada`,
        );
        return {
          success: false,
          message: `No se pudo encontrar la impresora especificada`,
        };
      }

      // Registrar la impresión
      const traceCreated = await this.prisma.samplePrinterTrace.create({
        data: {
          sampleId: sample.id,
          printerId: printer.id,
          count: count,
        },
      });

      this.logger.log(
        `Impresión registrada con éxito: ID=${traceCreated.id}, etiquetas=${count}`,
      );

      return {
        success: true,
        message: `Traza de impresión registrada correctamente (${count} etiquetas)`,
      };
    } catch (error: any) {
      this.logger.error(`Error al registrar impresión: ${error.message}`);
      return {
        success: false,
        message: `Error al registrar la traza de impresión`,
      };
    }
  }

  async printReceptionLabel(data: {
    sampleId: string;
    count: number;
    printerName?: string;
    skipConnectionTest?: boolean;
    companyId: string;
    companyName: string;
  }): Promise<PrintResult> {
    try {
      this.logger.log(`Iniciando impresión para muestra: ${data.sampleId}`);

      // 1. Obtener configuración de la impresora
      let printerConfig;
      if (data.printerName) {
        printerConfig = await this.getPrinterByName(data.printerName);
        if (!printerConfig) {
          this.logger.warn(`No se encontró la impresora: ${data.printerName}`);
          return {
            success: false,
            message: `No se pudo encontrar la impresora especificada`,
          };
        }
      }

      // 2. Verificar conexión si es necesario
      if (!data.skipConnectionTest && printerConfig) {
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

      // 3. Obtener el contador actual desde la base de datos
      let baseCount = 0;
      try {
        baseCount = await this.getCurrentSampleCount(data.sampleId);
        this.logger.log(
          `Contador actual para muestra ${data.sampleId}: ${baseCount}`,
        );
      } catch (error: any) {
        this.logger.error(`Error al obtener contador: ${error.message}`);
        return {
          success: false,
          message: `Error al obtener el contador de etiquetas: ${error.message}`,
        };
      }

      // 4. Preparar datos para la impresión
      const printData: PrintLabelDto = {
        qrCode: data.sampleId,
      };

      // 5. Imprimir las etiquetas
      try {
        // Aquí está la corrección - cada llamada a printLabel imprime 2 etiquetas
        // Por lo tanto, incrementamos de 2 en 2 y calculamos el número real de llamadas
        const callsNeeded = Math.ceil(data.count / 2);

        for (let i = 0; i < callsNeeded; i++) {
          const currentSeq = baseCount + i * 2 + 1;
          await this.printLabel(
            printData,
            data.companyName,
            printerConfig,
            currentSeq,
          );
        }
      } catch (error: any) {
        this.logger.error(`Error al imprimir etiquetas: ${error.message}`);
        return {
          success: false,
          message: `Error durante la impresión: ${error.message}`,
        };
      }

      // 6. Registrar impresión en la base de datos si se proporcionó nombre de impresora
      if (data.printerName) {
        try {
          // Es importante registrar el número exacto de etiquetas que se solicitaron
          const traceResult = await this.saveTrace(
            data.sampleId,
            data.printerName,
            data.count, // Usamos la cantidad exacta solicitada
          );
          if (!traceResult.success) {
            this.logger.warn(
              `No se pudo registrar la traza: ${traceResult.message}`,
            );
          }
        } catch (error: any) {
          this.logger.warn(`Error al registrar traza: ${error.message}`);
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

  // Este metodo no se está usando, curiositoooooo
  private async verifyPrinterConnection(
    printerConfig?: PrinterConfigDto,
  ): Promise<void> {
    const conexion = await this.testConnection(printerConfig);
    if (!conexion) {
      throw new Error('No se pudo establecer conexión con la impresora');
    }
  }

  async getPrinterByName(
    printerName: string,
  ): Promise<PrinterConfigDto | undefined> {
    try {
      this.logger.log(`Buscando impresora con nombre: ${printerName}`);

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

  async printLabel(
    data: Partial<PrintLabelDto>,
    companyName: string,
    config?: Partial<PrinterConfigDto>,
    sequenceNumber?: number,
  ): Promise<void> {
    // Configuración de la etiqueta ZPL para tamaño 50x25mm en 2 columnas
    const commands: string[] = [
      '^XA', // Inicio de etiqueta
      '^PW800', // Ancho total para 2 etiquetas (2x50mm = 100mm = 800 dots @ 203dpi)
      '^LL200', // Largo de etiqueta: 25mm (200 dots @ 203dpi)
      '^CF0,14,14', // Fuente predeterminada más pequeña
    ];

    // Etiqueta en la primera columna (izquierda) - centrada
    commands.push('^FO20,20^A0N,16,16^FB360,1,0,C^FD' + companyName + '^FS'); // Nombre compañía centrado
    commands.push('^FO20,40^GB360,1,1^FS'); // Línea separadora

    // Datos de la etiqueta izquierda
    if (sequenceNumber) {
      commands.push(
        '^FO20,60^A0N,14,14^FB180,1,0,C^FDEtiqueta: ' + sequenceNumber + '^FS',
      );
    }
    commands.push('^FO20,80^A0N,14,14^FB180,1,0,C^FDFecha:^FS');

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
      '^FO20,100^A0N,14,14^FB180,1,0,C^FD' +
        dateString +
        ' ' +
        timeString +
        '^FS',
    );

    // QR Code para primera etiqueta
    if (data.qrCode) {
      commands.push('^FO260,60^BQN,2,3^FDMA,' + data.qrCode + '^FS');
    }

    // Etiqueta en la segunda columna (derecha) - centrada
    commands.push('^FO420,20^A0N,16,16^FB360,1,0,C^FD' + companyName + '^FS'); // Nombre compañía centrado
    commands.push('^FO420,40^GB360,1,1^FS'); // Línea separadora

    // Datos de la etiqueta derecha (con contador incrementado)
    if (sequenceNumber) {
      commands.push(
        '^FO420,60^A0N,14,14^FB180,1,0,C^FDEtiqueta: ' +
          (sequenceNumber + 1) +
          '^FS',
      );
    }
    commands.push('^FO420,80^A0N,14,14^FB180,1,0,C^FDFecha:^FS');
    commands.push(
      '^FO420,100^A0N,14,14^FB180,1,0,C^FD' +
        dateString +
        ' ' +
        timeString +
        '^FS',
    );

    // QR Code para segunda etiqueta
    if (data.qrCode) {
      commands.push('^FO660,60^BQN,2,3^FDMA,' + data.qrCode + '^FS');
    }

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

  async getPrinters(companyId: string): Promise<any[]> {
    try {
      this.logger.log(`Consultando impresoras para compañía: ${companyId}`);

      // Obtener impresoras filtradas por compañía
      const printers = await this.prisma.printer.findMany({
        where: {
          companyId: companyId,
          isActive: true,
        },
        select: {
          id: true,
          printerName: true,
          ip: true,
          port: true,
          isActive: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          printerName: 'asc',
        },
      });

      this.logger.log(
        `Se encontraron ${printers.length} impresoras disponibles`,
      );
      return printers;
    } catch (error: any) {
      this.logger.error(`Error al obtener impresoras: ${error.message}`);
      return [];
    }
  }
}
