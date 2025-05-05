import { Injectable, Logger } from '@nestjs/common';
import { PrinterConfigDto, PrintLabelDto } from '@presentation/dtos/printer';
import * as net from 'net';

@Injectable()
export class LabelPrinterService {
  private readonly logger = new Logger(LabelPrinterService.name);

  // Configuración por defecto de la impresora
  private printerConfig: PrinterConfig = {
    ip: '192.168.1.123',
    port: 9100,
    timeout: 8000,
  };

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
   * Imprime una etiqueta con información de QR
   * @param data Datos para la etiqueta (QR y configuración)
   * @param config Configuración opcional para la impresora
   */
  async printLabel(
    data: Partial<PrintLabelDto>,
    config?: Partial<PrinterConfigDto>,
  ): Promise<void> {
    const commands: string[] = ['^XA', '^PW400', '^LL600'];

    let currentY = 20;

    // Añadir título si existe
    if (data.title) {
      commands.push(`^FO20,${currentY}^A0N,40,40^FD${data.title}^FS`);
      currentY += 60;
    }

    // Añadir líneas de texto
    if (data.lines && data.lines.length > 0) {
      data.lines.forEach((line) => {
        commands.push(`^FO20,${currentY}^A0N,30,30^FD${line}^FS`);
        currentY += 40;
      });
    }

    // Añadir código de barras si existe
    if (data.barcode) {
      // Código de barras Code 128 en ZPL
      commands.push(`^FO20,${currentY}^BY3^BCN,100,Y,N,N^FD${data.barcode}^FS`);
      currentY += 120;
    }

    // Añadir código QR si existe
    if (data.qrCode) {
      // Código QR en ZPL - ajustar el tamaño según necesidad
      commands.push(`^FO20,${currentY}^BQN,2,8^FDMA,${data.qrCode}^FS`);
    }

    // Finalizar etiqueta
    commands.push('^XZ');

    const zplCommand = commands.join('\r\n');

    // Agregar log para mostrar el ZPL generado
    this.logger.log(`ZPL generado para etiqueta: ${zplCommand}`);

    // Intentar enviar con el método más robusto para mayor probabilidad de éxito
    try {
      return await this.sendZplAlternative(zplCommand, config);
    } catch (err: any) {
      this.logger.error(`Error al imprimir etiqueta: ${err.message}`);
      throw err;
    }
  }

  private async sendToPrinter(
    commandBuffer: Buffer,
    config?: Partial<PrinterConfigDto>,
    encoding: BufferEncoding = 'ascii',
  ): Promise<void> {
    const printConfig = config
      ? { ...this.printerConfig, ...config }
      : this.printerConfig;

    // Crear socket con opciones explícitas
    const client = new net.Socket();

    // Configurar socket para evitar problemas comunes
    client.setKeepAlive(true);
    client.setTimeout(printConfig.timeout || 8000); // Valor por defecto si es undefined

    return new Promise((resolve, reject) => {
      // Variable para controlar si ya se ha manejado la promesa
      let isHandled = false;

      const handleEnd = (success: boolean, error?: Error) => {
        if (isHandled) return;
        isHandled = true;

        // Asegurar que el socket se cierre
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

      // Conectar con un tiempo de espera explícito
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

        // Enviar datos con callbacks explícitos de éxito/error
        client.write(commandBuffer, (err) => {
          if (err) {
            this.logger.error(`Error al enviar datos: ${err.message}`);
            return handleEnd(false, err);
          }

          this.logger.log(
            `Datos enviados correctamente a la impresora (${commandBuffer.length} bytes)`,
          );

          // Esperar un poco antes de cerrar la conexión
          setTimeout(() => {
            this.logger.log('Cerrando conexión con la impresora');
            handleEnd(true);
          }, 500); // Aumentar a 500ms para asegurar que todos los datos se envíen
        });
      });

      // Manejar eventos de error
      client.on('error', (err) => {
        this.logger.error(`Error de socket: ${err.message}`);
        clearTimeout(timeout);
        handleEnd(false, err);
      });

      // Manejar eventos de cierre inesperado
      client.on('close', (hadError) => {
        if (hadError) {
          this.logger.warn('Conexión cerrada con error');
        } else {
          this.logger.debug('Conexión cerrada sin errores');
        }
      });

      // Manejar datos que puedan venir de la impresora
      client.on('data', (data) => {
        this.logger.debug(
          `Datos recibidos de la impresora: ${data.toString('hex')}`,
        );
      });
    });
  }

  /**
   * Envía comandos ZPL directamente a la impresora sin modificaciones
   * @param zplCommands Comandos ZPL a enviar
   * @param config Configuración opcional de la impresora
   * @param encoding Codificación de caracteres a usar
   */
  async sendRawZpl(
    zplCommands: string,
    config?: Partial<PrinterConfigDto>,
    encoding: BufferEncoding = 'ascii',
  ): Promise<void> {
    // Ya no modificamos el ZPL, se envía exactamente como está para evitar problemas
    const commandBuffer = Buffer.from(zplCommands, encoding);
    this.logger.log(
      `Enviando comandos ZPL personalizados a la impresora (codificación: ${encoding})`,
    );

    return this.sendToPrinter(commandBuffer, config, encoding);
  }

  /**
   * Envía comandos ZPL usando un método alternativo que puede ser más compatible
   * @param zplCommands Comandos ZPL a enviar
   * @param config Configuración opcional de la impresora
   */
  async sendZplAlternative(
    zplCommands: string,
    config?: Partial<PrinterConfigDto>,
  ): Promise<void> {
    const printConfig = config
      ? { ...this.printerConfig, ...config }
      : this.printerConfig;

    // Intentar tres métodos diferentes de envío
    const errors: Error[] = [];

    // Método 1: Modo normal con ASCII
    try {
      this.logger.log('Intentando envío con método 1 (ASCII)');
      await this.sendRawZpl(zplCommands, printConfig, 'ascii');
      return; // Si funciona, terminamos
    } catch (err: any) {
      errors.push(err);
      this.logger.warn(`Método 1 falló: ${err.message}`);
    }

    // Método 2: UTF8 sin BOM
    try {
      this.logger.log('Intentando envío con método 2 (UTF8)');
      await this.sendRawZpl(zplCommands, printConfig, 'utf8');
      return; // Si funciona, terminamos
    } catch (err: any) {
      errors.push(err);
      this.logger.warn(`Método 2 falló: ${err.message}`);
    }

    // Método 3: Envío byte por byte (más lento pero más confiable)
    try {
      this.logger.log('Intentando envío con método 3 (byte por byte)');
      await this.sendByteByByte(zplCommands, printConfig);
      return; // Si funciona, terminamos
    } catch (err: any) {
      errors.push(err);
      this.logger.warn(`Método 3 falló: ${err.message}`);
    }

    // Si todos los métodos fallan, lanzamos error
    throw new Error(
      `Todos los métodos de envío fallaron: ${errors.map((e) => e.message).join(', ')}`,
    );
  }

  /**
   * Envía comandos ZPL byte por byte, método más lento pero a veces más confiable
   * @param zplCommands Comandos ZPL a enviar
   * @param config Configuración opcional
   * @private
   */
  private async sendByteByByte(
    zplCommands: string,
    config?: Partial<PrinterConfigDto>,
  ): Promise<void> {
    const printConfig = config
      ? { ...this.printerConfig, ...config }
      : this.printerConfig;

    // Agregar log para mostrar el ZPL que se enviará byte por byte

    const client = new net.Socket();
    client.setKeepAlive(true);

    return new Promise<void>((resolve, reject) => {
      let isConnected = false;

      const timeout = setTimeout(() => {
        if (client) client.destroy();
        reject(new Error('Timeout en la conexión'));
      }, printConfig.timeout || 8000);

      client.on('error', (err) => {
        clearTimeout(timeout);
        client.destroy();
        reject(err);
      });

      client.connect(printConfig.port, printConfig.ip, async () => {
        clearTimeout(timeout);
        isConnected = true;
        this.logger.log('Conectado para envío byte por byte');

        // Convertir a buffer de bytes
        const buffer = Buffer.from(zplCommands, 'ascii');

        try {
          // Enviar bytes con pequeñas pausas
          for (let i = 0; i < buffer.length; i++) {
            await new Promise<void>((res) => {
              client.write(Buffer.from([buffer[i]]), () => {
                // Pequeña pausa entre bytes
                setTimeout(res, 2);
              });
            });
          }

          this.logger.log('Envío byte por byte completado');

          // Esperar antes de cerrar
          await new Promise((res) => setTimeout(res, 500));
          client.destroy();
          resolve();
        } catch (err) {
          client.destroy();
          reject(err);
        }
      });
    });
  }
}
