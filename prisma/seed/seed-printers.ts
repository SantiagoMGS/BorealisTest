import { PrismaClient } from '@prisma/client';
import { printerInitialData } from './data/printers.data';
import { Logger } from '@nestjs/common';

export const seedPrinters = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedPrinters');
  try {
    logger.log('Iniciando sembrado de impresoras...');

    const printerCount = await prisma.printer.count();

    if (printerCount > 0) {
      logger.log(
        `Ya existen ${printerCount} impresoras en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    for (const printerData of printerInitialData) {
      const companyName = (printerData.company as any).connect.name;
      const company = await prisma.company.findUnique({
        where: { name: companyName },
      });

      if (!company) {
        logger.warn(
          `No se encontró la compañía con nombre: ${companyName}. Asegúrate de que las compañías existan antes de crear impresoras.`,
        );
        return;
      }
    }

    const results = await Promise.all(
      printerInitialData.map(async (printerData) => {
        return prisma.printer
          .create({
            data: printerData,
          })
          .then((printer) => ({ success: true, printer }))
          .catch((error) => {
            logger.error(
              `Error al crear impresora ${printerData.printerName}: ${error.message}`,
            );
            return { success: false, error, name: printerData.printerName };
          });
      }),
    );

    const successfulPrinters = results.filter((r) => r.success) as Array<{
      success: true;
      printer: any;
    }>;
    const failedPrinters = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulPrinters.length} impresoras con éxito.`,
    );

    if (failedPrinters.length > 0) {
      logger.warn(`No se pudieron crear ${failedPrinters.length} impresoras.`);
      failedPrinters.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    successfulPrinters.forEach((result) => {
      if (result.printer) {
        logger.log(
          `Impresora creada: ${result.printer.printerName} - IP: ${result.printer.ip}:${result.printer.port}`,
        );
      }
    });
  } catch (error: any) {
    logger.error(`Error general al sembrar impresoras: ${error.message}`);
    throw error;
  }
};
