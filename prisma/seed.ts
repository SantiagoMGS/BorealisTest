import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import {
  seedUsers,
  seedCompanies,
  seedApplications,
  seedResources,
  seedSubresources,
  seedActions,
  seedApplicationResources,
  seedCompanyApplications,
  seedRoles,
  seedRolePermissions,
  seedUserCompanies,
} from './seed/index';

// Inicializar cliente Prisma
const prisma = new PrismaClient();
const logger = new Logger('DatabaseSeed');

// Función principal de sembrado
async function main() {
  try {
    logger.log('🌱 Iniciando proceso de sembrado de datos...');

    // Ejecutar semillas en orden
    await seedApplications(prisma); // Primero las aplicaciones
    await seedCompanies(prisma); // Después las compañías
    await seedCompanyApplications(prisma); // Relaciones entre compañías y aplicaciones
    await seedUsers(prisma); // Luego los usuarios
    await seedRoles(prisma); // Roles
    await seedUserCompanies(prisma); // Relaciones entre usuarios, compañías y roles
    await seedActions(prisma); // Acciones para permisos
    await seedResources(prisma); // Después los recursos
    await seedSubresources(prisma); // Subrecursos que dependen de recursos
    await seedApplicationResources(prisma); // Finalmente recursos de aplicaciones
    await seedRolePermissions(prisma); // Permisos de roles (debe ejecutarse al final)

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
