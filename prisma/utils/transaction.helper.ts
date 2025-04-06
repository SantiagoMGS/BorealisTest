import { PrismaClient } from '@prisma/client';

/**
 * Tipo para las opciones de transacción de Prisma basado en la documentación
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/transactions
 */
type PrismaTransactionOptions = {
  maxWait?: number;
  timeout?: number;
  isolationLevel?:
    | 'ReadUncommitted'
    | 'ReadCommitted'
    | 'RepeatableRead'
    | 'Serializable';
};

/**
 * Ejecuta una operación dentro de una transacción Prisma
 * Proporciona manejo de errores y logging consistente
 *
 * @param prisma Cliente Prisma
 * @param operation Función que contiene la operación a ejecutar
 * @param options Opciones de la transacción
 * @returns Resultado de la operación
 */
export async function executeTransaction<T>(
  prisma: PrismaClient,
  operation: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) => Promise<T>,
  options: PrismaTransactionOptions = {
    timeout: 10000,
    isolationLevel: 'Serializable',
  },
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    try {
      return await operation(tx);
    } catch (error) {
      console.error('❌ Error en la transacción:', error);
      throw error; // Re-lanzamos el error para revertir la transacción
    }
  }, options);
}

/**
 * Ejecuta operaciones de batch dentro de una transacción
 * Útil para procesar arrays de datos
 *
 * @param prisma Cliente Prisma
 * @param items Array de items a procesar
 * @param processFn Función para procesar cada item
 * @param options Opciones de la transacción
 * @returns Array de resultados
 */
export async function batchTransaction<T, R>(
  prisma: PrismaClient,
  items: T[],
  processFn: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    item: T,
    index: number,
  ) => Promise<R>,
  options?: PrismaTransactionOptions,
): Promise<R[]> {
  return executeTransaction(
    prisma,
    async (tx) => {
      const results: R[] = [];

      for (let i = 0; i < items.length; i++) {
        try {
          const result = await processFn(tx, items[i], i);
          results.push(result);
          console.log(
            `✅ Item ${i + 1}/${items.length} procesado correctamente`,
          );
        } catch (error) {
          console.error(
            `❌ Error procesando item ${i + 1}/${items.length}:`,
            error,
          );
          throw error; // Propagamos el error para que la transacción se revierta
        }
      }

      return results;
    },
    options,
  );
}
