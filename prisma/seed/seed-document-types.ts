import { PrismaClient } from '@prisma/client';
import { documentTypeInitialData } from './data/document-types.data';
import { Logger } from '@nestjs/common';

export const seedDocumentTypes = async (prisma: PrismaClient) => {
  const logger = new Logger('SeedDocumentTypes');
  try {
    logger.log('Iniciando sembrado de tipos de documento...');

    // Verificar si ya existen tipos de documento para evitar duplicados
    const docTypeCount = await prisma.documentType.count();

    if (docTypeCount > 0) {
      logger.log(
        `Ya existen ${docTypeCount} tipos de documento en la base de datos. Omitiendo sembrado.`,
      );
      return;
    }

    // Crear tipos de documento desde los datos iniciales
    const results = await Promise.all(
      documentTypeInitialData.map(async (docTypeData) => {
        return prisma.documentType
          .create({
            data: docTypeData,
          })
          .then((docType) => ({ success: true, docType }))
          .catch((error) => {
            logger.error(
              `Error al crear tipo de documento ${docTypeData.name}: ${error.message}`,
            );
            return { success: false, error, name: docTypeData.name };
          });
      }),
    );

    // Contar resultados
    const successfulDocTypes = results.filter((r) => r.success) as Array<{
      success: true;
      docType: any;
    }>;
    const failedDocTypes = results.filter((r) => !r.success) as Array<{
      success: false;
      error: any;
      name: string;
    }>;

    logger.log(
      `Se han creado ${successfulDocTypes.length} tipos de documento con éxito.`,
    );

    if (failedDocTypes.length > 0) {
      logger.warn(
        `No se pudieron crear ${failedDocTypes.length} tipos de documento.`,
      );
      failedDocTypes.forEach((result) => {
        logger.warn(`- Falló al crear: ${result.name}`);
      });
    }

    // Mostrar los tipos de documento creados
    successfulDocTypes.forEach((result) => {
      if (result.docType) {
        logger.log(
          `Tipo de documento creado: ${result.docType.name} (${result.docType.code})`,
        );
      }
    });
  } catch (error: any) {
    logger.error(
      `Error general al sembrar tipos de documento: ${error.message}`,
    );
    throw error;
  }
};
