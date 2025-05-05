import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';

interface LabelData {
  title?: string;
  lines?: string[];
  barcode?: string;
  qrCode?: string;
}

interface PrinterConfig {
  ip: string;
  port: number;
  timeout?: number;
}

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
   * Actualiza la configuración de la impresora
   * @param config Nueva configuración
   */
  updatePrinterConfig(config: Partial<PrinterConfig>): void {
    this.printerConfig = { ...this.printerConfig, ...config };
    this.logger.log(
      `Configuración de impresora actualizada: ${JSON.stringify(this.printerConfig)}`,
    );
  }

  /**
   * Verifica la conexión con la impresora
   * @param config Configuración opcional para la prueba
   * @returns {Promise<boolean>} true si la conexión es exitosa, false en caso contrario
   */
  async testConnection(config?: Partial<PrinterConfig>): Promise<boolean> {
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

  async printTicket(
    text: string,
    config?: Partial<PrinterConfig>,
  ): Promise<void> {
    // Convertir a comandos ZPL
    const lines = text.split('\n');
    const lineCommands = lines.map((line, index) => {
      const y = 20 + index * 40;
      // Comando para texto en ZPL
      return `^FO20,${y}^A0N,30,30^FD${line}^FS`;
    });

    // Comandos ZPL para iniciar y finalizar etiqueta
    const zplCommand = ['^XA', '^PW400', '^LL600', ...lineCommands, '^XZ'].join(
      '\r\n',
    );

    // Agregar log para mostrar el ZPL generado
    this.logger.log(`ZPL generado para ticket: ${zplCommand}`);

    const commandBuffer = Buffer.from(zplCommand, 'ascii');

    return this.sendToPrinter(commandBuffer, config);
  }

  async printLabel(
    data: LabelData,
    config?: Partial<PrinterConfig>,
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

    const commandBuffer = Buffer.from(zplCommand, 'ascii');

    return this.sendToPrinter(commandBuffer, config);
  }

  private async sendToPrinter(
    commandBuffer: Buffer,
    config?: Partial<PrinterConfig>,
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

        // Convertir el buffer a hexadecimal para debugging
        console.log(commandBuffer);

        const hexData = commandBuffer.toString('hex');
        this.logger.debug(`Enviando datos HEX: ${hexData}`);

        // Agregar log detallado del ZPL
        this.logger.log(
          `Enviando ZPL (${commandBuffer.length} bytes): ${commandBuffer.toString(encoding)}`,
        );

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
    config?: Partial<PrinterConfig>,
    encoding: BufferEncoding = 'ascii',
  ): Promise<void> {
    // Ya no modificamos el ZPL, se envía exactamente como está para evitar problemas
    const commandBuffer = Buffer.from(zplCommands, encoding);
    this.logger.log(
      `Enviando comandos ZPL personalizados a la impresora (codificación: ${encoding})`,
    );
    this.logger.log(
      `ZPL a enviar (${zplCommands.length} caracteres): ${zplCommands}`,
    );

    return this.sendToPrinter(commandBuffer, config, encoding);
  }

  /**
   * Realiza un diagnóstico completo de la comunicación con la impresora
   * @param config Configuración opcional de la impresora
   */
  async diagnosticoPrinter(config?: Partial<PrinterConfig>): Promise<{
    ping: boolean;
    conexion: boolean;
    impresionTest?: boolean;
    error?: string;
  }> {
    const result: {
      ping: boolean;
      conexion: boolean;
      impresionTest?: boolean;
      error?: string;
    } = {
      ping: false,
      conexion: false,
    };

    const printConfig = config
      ? { ...this.printerConfig, ...config }
      : this.printerConfig;

    try {
      // Paso 1: Ping
      const pingResult = await this.pingHost(printConfig.ip);
      result.ping = pingResult;

      if (!pingResult) {
        result.error = `No se puede hacer ping a la dirección ${printConfig.ip}`;
        return result;
      }

      // Paso 2: Probar conexión al puerto
      const conexionResult = await this.testConnection(printConfig);
      result.conexion = conexionResult;

      if (!conexionResult) {
        result.error = `No se puede conectar al puerto ${printConfig.port} en ${printConfig.ip}`;
        return result;
      }

      // Paso 3: Enviar un comando ZPL de prueba simple
      try {
        // Comando ZPL más simple posible
        const simpleZpl = '^XA^FO20,20^FDPrueba^FS^XZ';

        // Agregar log para mostrar el ZPL de prueba
        this.logger.log(`ZPL de diagnóstico: ${simpleZpl}`);

        // Probar con múltiples codificaciones
        const encodings: BufferEncoding[] = ['ascii', 'latin1', 'utf8'];
        let impresionExitosa = false;

        for (const enc of encodings) {
          try {
            this.logger.log(
              `Intentando impresión de prueba con codificación: ${enc}`,
            );
            await this.sendRawZpl(simpleZpl, printConfig, enc);
            impresionExitosa = true;
            break; // Si funciona, salimos del ciclo
          } catch (err: any) {
            this.logger.warn(`Error con codificación ${enc}: ${err.message}`);
            // Continuamos con la siguiente codificación
          }
        }

        result.impresionTest = impresionExitosa;

        if (!impresionExitosa) {
          result.error = 'No se pudo imprimir con ninguna codificación';
        }
      } catch (err: any) {
        result.impresionTest = false;
        result.error = `Error en impresión de prueba: ${err.message}`;
      }

      return result;
    } catch (err: any) {
      result.error = `Error general: ${err.message}`;
      return result;
    }
  }

  /**
   * Realiza un ping al host especificado
   * @param host Dirección IP o nombre de host
   * @private
   */
  private async pingHost(host: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const socket = new net.Socket();

      socket.setTimeout(1000);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(80, host);
    });
  }

  /**
   * Envía comandos ZPL usando un método alternativo que puede ser más compatible
   * @param zplCommands Comandos ZPL a enviar
   * @param config Configuración opcional de la impresora
   */
  async sendZplAlternative(
    zplCommands: string,
    config?: Partial<PrinterConfig>,
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
    config?: Partial<PrinterConfig>,
  ): Promise<void> {
    const printConfig = config
      ? { ...this.printerConfig, ...config }
      : this.printerConfig;

    // Agregar log para mostrar el ZPL que se enviará byte por byte
    this.logger.log(`ZPL a enviar byte por byte: ${zplCommands}`);

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

  /**
   * Envía un comando para hacer que la impresora emita un pitido
   * (útil para verificar si la impresora recibe correctamente los comandos)
   * @param config Configuración opcional de la impresora
   */
  async sendBeep(config?: Partial<PrinterConfig>): Promise<void> {
    // Comando ZPL para hacer que la impresora emita un pitido
    const beepCommand = '^XA^SZ2^JMA^XZ';
    this.logger.log(
      `Enviando comando de pitido a la impresora: ${beepCommand}`,
    );

    // Intentar el envío de varias formas
    try {
      await this.sendRawZpl(beepCommand, config);
    } catch (err: any) {
      this.logger.warn(`Fallo en primer intento de pitido: ${err.message}`);
      try {
        // Segundo intento con método alternativo
        await this.sendByteByByte(beepCommand, config);
      } catch (err2: any) {
        this.logger.error(
          `No se pudo enviar comando de pitido: ${err2.message}`,
        );
        throw err2;
      }
    }
  }

  /**
   * Envía un comando para forzar la calibración de la impresora
   * @param config Configuración opcional de la impresora
   */
  async forcePrinterCalibration(
    config?: Partial<PrinterConfig>,
  ): Promise<void> {
    // Comando ZPL para calibración
    const calibrationCommand = '^XA^JC^XZ';
    this.logger.log(
      `Enviando comando de calibración a la impresora: ${calibrationCommand}`,
    );

    try {
      await this.sendRawZpl(calibrationCommand, config);
    } catch (err: any) {
      this.logger.warn(
        `Fallo en primer intento de calibración: ${err.message}`,
      );
      try {
        await this.sendByteByByte(calibrationCommand, config);
      } catch (err2: any) {
        this.logger.error(
          `No se pudo enviar comando de calibración: ${err2.message}`,
        );
        throw err2;
      }
    }
  }

  /**
   * Envía un comando de ZPL extremadamente básico que debería funcionar
   * en cualquier impresora compatible con ZPL
   * @param config Configuración opcional de la impresora
   */
  async sendBasicTest(config?: Partial<PrinterConfig>): Promise<void> {
    // Comando ZPL extremadamente básico (sin caracteres especiales ni formateo complejo)
    const basicCommand = '^XA^FO20,20^A0N,40,40^FDTEST PRINT^FS^XZ';
    this.logger.log(
      `Enviando comando de prueba básica a la impresora: ${basicCommand}`,
    );

    try {
      // Primero intentar enviarlo normalmente
      await this.sendRawZpl(basicCommand, config);
    } catch (err: any) {
      this.logger.warn(
        `Fallo en primer intento de prueba básica: ${err.message}`,
      );
      try {
        // Luego probar el método byte por byte
        await this.sendByteByByte(basicCommand, config);
      } catch (err2: any) {
        this.logger.error(
          `No se pudo enviar comando de prueba básica: ${err2.message}`,
        );
        throw err2;
      }
    }
  }

  /**
   * Envía un comando para hacer un reset suave de la impresora
   * Útil cuando la impresora deja de responder
   * @param config Configuración opcional de la impresora
   */
  async resetPrinter(config?: Partial<PrinterConfig>): Promise<void> {
    // Comando ZPL para reset
    const resetCommand = '^XA^JUS^XZ';
    this.logger.log(
      `Enviando comando de reset a la impresora: ${resetCommand}`,
    );

    try {
      await this.sendRawZpl(resetCommand, config);
    } catch (err: any) {
      this.logger.warn(`Fallo en primer intento de reset: ${err.message}`);
      try {
        await this.sendByteByByte(resetCommand, config);
      } catch (err2: any) {
        this.logger.error(
          `No se pudo enviar comando de reset: ${err2.message}`,
        );
        throw err2;
      }
    }
  }

  /**
   * Envía un comando para hacer avanzar el papel (útil para verificar si hay papel)
   * @param config Configuración opcional de la impresora
   */
  async feedPaper(config?: Partial<PrinterConfig>): Promise<void> {
    // Comando ZPL para avanzar papel
    const feedCommand = '~PS';
    this.logger.log(
      `Enviando comando de avance de papel a la impresora: ${feedCommand}`,
    );

    try {
      await this.sendRawZpl(feedCommand, config);
    } catch (err: any) {
      this.logger.warn(
        `Fallo en primer intento de avance de papel: ${err.message}`,
      );
      try {
        await this.sendByteByByte(feedCommand, config);
      } catch (err2: any) {
        this.logger.error(
          `No se pudo enviar comando de avance de papel: ${err2.message}`,
        );
        throw err2;
      }
    }
  }

  /**
   * Envía una serie completa de comandos de diagnóstico en secuencia.
   * Útil cuando no estamos seguros de qué comando puede ayudar.
   * @param config Configuración opcional de la impresora
   */
  async fullDiagnostic(config?: Partial<PrinterConfig>): Promise<{
    ping: boolean;
    connection: boolean;
    results: Record<string, boolean>;
  }> {
    const results: Record<string, boolean> = {
      reset: false,
      feed: false,
      beep: false,
      calibration: false,
      basicPrint: false,
    };

    // Primero verificar conectividad
    const pingResult = await this.pingHost(config?.ip || this.printerConfig.ip);
    if (!pingResult) {
      return { ping: false, connection: false, results };
    }

    const connectionResult = await this.testConnection(config);
    if (!connectionResult) {
      return { ping: true, connection: false, results };
    }

    // Intentar cada comando en secuencia
    try {
      await this.resetPrinter(config);
      results.reset = true;

      // Esperar un poco después del reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        await this.feedPaper(config);
        results.feed = true;
      } catch (e) {
        this.logger.warn('Feed de papel falló');
      }

      try {
        await this.sendBeep(config);
        results.beep = true;
      } catch (e) {
        this.logger.warn('Comando de beep falló');
      }

      try {
        await this.forcePrinterCalibration(config);
        results.calibration = true;
      } catch (e) {
        this.logger.warn('Calibración falló');
      }

      try {
        await this.sendBasicTest(config);
        results.basicPrint = true;
      } catch (e) {
        this.logger.warn('Impresión básica falló');
      }

      return { ping: true, connection: true, results };
    } catch (err) {
      this.logger.error('Error en diagnóstico completo');
      return { ping: true, connection: true, results };
    }
  }
}
