import { LabelPrinterService } from '@infrastructure/integrations/label-printer.service';
import { Controller, Post, Body, Get, Logger, Put } from '@nestjs/common';

// Importamos las interfaces del servicio
interface PrinterConfig {
  ip: string;
  port: number;
  timeout?: number;
}

interface PrintLabelDto {
  text?: string;
  title?: string;
  lines?: string[];
  barcode?: string;
  qrCode?: string;
  skipConnectionTest?: boolean;
  printerConfig?: Partial<PrinterConfig>;
}

@Controller('printer')
export class LabelPrinterController {
  private readonly logger = new Logger(LabelPrinterController.name);

  constructor(private readonly labelPrinterService: LabelPrinterService) {}

  /**
   * Verificar la conexión con la impresora
   */
  @Get('test-connection')
  async testConnection(@Body() datos?: { ip?: string; port?: number }) {
    try {
      const result = await this.labelPrinterService.testConnection(datos);
      return {
        success: result,
        message: result
          ? 'Conexión exitosa con la impresora'
          : 'No se pudo conectar con la impresora',
      };
    } catch (error: any) {
      this.logger.error(`Error en prueba de conexión: ${error.message}`);
      return {
        success: false,
        message: 'Error durante la prueba de conexión',
        error: error.message,
      };
    }
  }

  /**
   * Actualizar configuración de la impresora
   */
  @Put('config')
  async updateConfig(
    @Body() config: { ip?: string; port?: number; timeout?: number },
  ) {
    try {
      this.labelPrinterService.updatePrinterConfig(config);
      return {
        success: true,
        message: 'Configuración actualizada correctamente',
        config,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error al actualizar la configuración',
        error: error.message,
      };
    }
  }

  /**
   * Enviar texto para imprimir como etiqueta simple
   */
  @Post('print-text')
  async printSimpleLabel(@Body() datos: PrintLabelDto) {
    const resultado: {
      conexion: any;
      impresion: any;
    } = {
      conexion: null,
      impresion: null,
    };

    try {
      // Validación básica
      if (!datos.text || datos.text.trim() === '') {
        throw new Error('El texto a imprimir está vacío');
      }

      // Paso 1: Verificar conexión si no se omite
      if (!datos.skipConnectionTest) {
        resultado.conexion = await this.labelPrinterService.testConnection(
          datos.printerConfig,
        );
        if (!resultado.conexion) {
          throw new Error('No se pudo establecer conexión con la impresora');
        }
      }

      // Paso 2: Imprimir
      this.logger.log(`Enviando a imprimir texto: '${datos.text}'`);
      await this.labelPrinterService.printTicket(
        datos.text,
        datos.printerConfig,
      );
      resultado.impresion = { success: true, text: datos.text };
      this.logger.log('Impresión completada');

      return {
        success: true,
        message: 'Etiqueta impresa correctamente',
        resultado,
      };
    } catch (error: any) {
      this.logger.error(
        `Error al imprimir: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        success: false,
        message: 'Error durante la impresión',
        error: error instanceof Error ? error.message : String(error),
        resultado,
      };
    }
  }

  /**
   * Imprimir etiqueta compleja (con título, texto, códigos de barras, etc.)
   */
  @Post('print-label')
  async printComplexLabel(@Body() datos: PrintLabelDto) {
    const resultado: {
      conexion: any;
      impresion: any;
    } = {
      conexion: null,
      impresion: null,
    };

    try {
      // Validación básica
      if (
        !datos.title &&
        !datos.lines?.length &&
        !datos.barcode &&
        !datos.qrCode
      ) {
        throw new Error('No hay contenido para imprimir');
      }

      // Paso 1: Verificar conexión si no se omite
      if (!datos.skipConnectionTest) {
        resultado.conexion = await this.labelPrinterService.testConnection(
          datos.printerConfig,
        );
        if (!resultado.conexion) {
          throw new Error('No se pudo establecer conexión con la impresora');
        }
      }

      // Paso 2: Imprimir
      this.logger.log('Enviando a imprimir etiqueta compleja');
      await this.labelPrinterService.printLabel(
        {
          title: datos.title,
          lines: datos.lines,
          barcode: datos.barcode,
          qrCode: datos.qrCode,
        },
        datos.printerConfig,
      );

      resultado.impresion = {
        success: true,
        data: {
          title: datos.title,
          lines: datos.lines?.length || 0,
          hasBarcode: !!datos.barcode,
          hasQr: !!datos.qrCode,
        },
      };

      this.logger.log('Impresión completada');

      return {
        success: true,
        message: 'Etiqueta impresa correctamente',
        resultado,
      };
    } catch (error: any) {
      this.logger.error(
        `Error al imprimir: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        success: false,
        message: 'Error durante la impresión',
        error: error instanceof Error ? error.message : String(error),
        resultado,
      };
    }
  }

  /**
   * Enviar comandos ZPL personalizados directamente a la impresora
   */
  @Post('print-raw-zpl')
  async printRawZpl(
    @Body()
    datos: {
      zpl: string;
      printerConfig?: PrinterConfig;
      skipConnectionTest?: boolean;
      encoding?: BufferEncoding;
    },
  ) {
    const resultado: {
      conexion: any;
      impresion: any;
    } = {
      conexion: null,
      impresion: null,
    };

    try {
      // Validación básica
      if (!datos.zpl || datos.zpl.trim() === '') {
        throw new Error('El comando ZPL está vacío');
      }

      // Paso 1: Verificar conexión si no se omite
      if (!datos.skipConnectionTest) {
        resultado.conexion = await this.labelPrinterService.testConnection(
          datos.printerConfig,
        );
        if (!resultado.conexion) {
          throw new Error('No se pudo establecer conexión con la impresora');
        }
      }

      // Paso 2: Imprimir
      this.logger.log('Enviando comandos ZPL personalizados a la impresora');
      await this.labelPrinterService.sendRawZpl(
        datos.zpl,
        datos.printerConfig,
        datos.encoding || 'ascii',
      );

      resultado.impresion = {
        success: true,
        zplLength: datos.zpl.length,
      };

      this.logger.log('Impresión completada');

      return {
        success: true,
        message: 'Comandos ZPL enviados correctamente',
        resultado,
      };
    } catch (error: any) {
      this.logger.error(
        `Error al imprimir ZPL personalizado: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        success: false,
        message: 'Error durante la impresión de ZPL personalizado',
        error: error instanceof Error ? error.message : String(error),
        resultado,
      };
    }
  }

  /**
   * Realiza un diagnóstico completo de la impresora
   */
  @Get('diagnostico')
  async diagnosticarImpresora(
    @Body() datos?: { ip?: string; port?: number; timeout?: number },
  ) {
    try {
      this.logger.log('Iniciando diagnóstico completo de impresora');
      const resultado =
        await this.labelPrinterService.diagnosticoPrinter(datos);

      return {
        success:
          resultado.ping &&
          resultado.conexion &&
          resultado.impresionTest === true,
        diagnostico: resultado,
        mensaje:
          resultado.error ||
          (resultado.impresionTest === true
            ? 'Diagnóstico completo: La impresora está completamente operativa'
            : 'Diagnóstico parcial: Se detectaron algunos problemas'),
      };
    } catch (error: any) {
      this.logger.error(`Error en diagnóstico: ${error.message}`);
      return {
        success: false,
        mensaje: 'Error al realizar el diagnóstico',
        error: error.message,
      };
    }
  }

  /**
   * Enviar comandos ZPL personalizados usando método alternativo
   * con múltiples intentos de compatibilidad
   */
  @Post('print-alternative')
  async printZplAlternative(
    @Body()
    datos: {
      zpl: string;
      printerConfig?: PrinterConfig;
      skipConnectionTest?: boolean;
    },
  ) {
    const resultado: {
      conexion: any;
      impresion: any;
    } = {
      conexion: null,
      impresion: null,
    };

    try {
      // Validación básica
      if (!datos.zpl || datos.zpl.trim() === '') {
        throw new Error('El comando ZPL está vacío');
      }

      // Paso 1: Verificar conexión si no se omite
      if (!datos.skipConnectionTest) {
        resultado.conexion = await this.labelPrinterService.testConnection(
          datos.printerConfig,
        );
        if (!resultado.conexion) {
          throw new Error('No se pudo establecer conexión con la impresora');
        }
      }

      // Paso 2: Imprimir usando método alternativo
      this.logger.log('Enviando comandos ZPL con método alternativo');
      await this.labelPrinterService.sendZplAlternative(
        datos.zpl,
        datos.printerConfig,
      );

      resultado.impresion = {
        success: true,
        zplLength: datos.zpl.length,
        method: 'alternative',
      };

      this.logger.log('Impresión alternativa completada');

      return {
        success: true,
        message: 'Comandos ZPL enviados correctamente con método alternativo',
        resultado,
      };
    } catch (error: any) {
      this.logger.error(
        `Error en impresión alternativa: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        success: false,
        message: 'Error durante la impresión con método alternativo',
        error: error instanceof Error ? error.message : String(error),
        resultado,
      };
    }
  }

  /**
   * Envía un comando básico de prueba a la impresora (sin caracteres especiales)
   */
  @Post('test-basic')
  async testBasic(@Body() datos?: { ip?: string; port?: number }) {
    try {
      this.logger.log('Enviando prueba básica a la impresora');
      await this.labelPrinterService.sendBasicTest(datos);
      return {
        success: true,
        message: 'Comando de prueba básica enviado correctamente',
      };
    } catch (error: any) {
      this.logger.error(`Error en prueba básica: ${error.message}`);
      return {
        success: false,
        message: 'Error al enviar prueba básica',
        error: error.message,
      };
    }
  }

  /**
   * Hace que la impresora emita un pitido (útil para verificar comunicación)
   */
  @Post('beep')
  async beepPrinter(@Body() datos?: { ip?: string; port?: number }) {
    try {
      this.logger.log('Enviando comando de pitido a la impresora');
      await this.labelPrinterService.sendBeep(datos);
      return {
        success: true,
        message: 'Comando de pitido enviado correctamente',
      };
    } catch (error: any) {
      this.logger.error(`Error al enviar pitido: ${error.message}`);
      return {
        success: false,
        message: 'Error al enviar comando de pitido',
        error: error.message,
      };
    }
  }

  /**
   * Envía un comando de calibración a la impresora
   */
  @Post('calibrate')
  async calibratePrinter(@Body() datos?: { ip?: string; port?: number }) {
    try {
      this.logger.log('Enviando comando de calibración a la impresora');
      await this.labelPrinterService.forcePrinterCalibration(datos);
      return {
        success: true,
        message: 'Comando de calibración enviado correctamente',
      };
    } catch (error: any) {
      this.logger.error(`Error al calibrar: ${error.message}`);
      return {
        success: false,
        message: 'Error al enviar comando de calibración',
        error: error.message,
      };
    }
  }

  /**
   * Envía un comando de reset a la impresora
   */
  @Post('reset')
  async resetPrinter(@Body() datos?: { ip?: string; port?: number }) {
    try {
      this.logger.log('Enviando comando de reset a la impresora');
      await this.labelPrinterService.resetPrinter(datos);
      return {
        success: true,
        message: 'Comando de reset enviado correctamente',
      };
    } catch (error: any) {
      this.logger.error(`Error al resetear: ${error.message}`);
      return {
        success: false,
        message: 'Error al enviar comando de reset',
        error: error.message,
      };
    }
  }

  /**
   * Envía un comando para hacer avanzar el papel
   */
  @Post('feed')
  async feedPaper(@Body() datos?: { ip?: string; port?: number }) {
    try {
      this.logger.log('Enviando comando de avance de papel');
      await this.labelPrinterService.feedPaper(datos);
      return {
        success: true,
        message: 'Comando de feed enviado correctamente',
      };
    } catch (error: any) {
      this.logger.error(`Error al avanzar papel: ${error.message}`);
      return {
        success: false,
        message: 'Error al enviar comando de avance de papel',
        error: error.message,
      };
    }
  }

  /**
   * Realiza un diagnóstico completo con todos los comandos disponibles
   */
  @Get('full-diagnostic')
  async fullDiagnostic(@Body() datos?: { ip?: string; port?: number }) {
    try {
      this.logger.log('Iniciando diagnóstico completo con todos los comandos');
      const resultado = await this.labelPrinterService.fullDiagnostic(datos);

      const totalTests = Object.keys(resultado.results).length;
      const passedTests = Object.values(resultado.results).filter(
        (v) => v,
      ).length;

      return {
        success: resultado.ping && resultado.connection && passedTests > 0,
        message: `Diagnóstico completo: ${passedTests}/${totalTests} comandos exitosos`,
        resultado,
      };
    } catch (error: any) {
      this.logger.error(`Error en diagnóstico completo: ${error.message}`);
      return {
        success: false,
        message: 'Error al realizar diagnóstico completo',
        error: error.message,
      };
    }
  }
}
