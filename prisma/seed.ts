import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed/seed-users';
import { Logger } from '@nestjs/common';

// Inicializar cliente Prisma
const prisma = new PrismaClient();
const logger = new Logger('DatabaseSeed');

// Función principal de sembrado
async function main() {
  try {
    logger.log('🌱 Iniciando proceso de sembrado de datos...');

    // Ejecutar semillas en orden
    await seedUsers(prisma);

    logger.log('✅ ¡Proceso de sembrado completado con éxito!');
  } catch (error: any) {
    logger.error(`❌ Error durante el sembrado: ${error.message}`);
    process.exit(1);
  } finally {
    // Cerrar conexión a la base de datos
    await prisma.$disconnect();
  }
}

// Ejecutar función principal
main();
