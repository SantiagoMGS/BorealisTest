import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import {
  seedUsers,
  seedCompanies,
  seedApplications,
  seedResources,
  seedSubresources,
  seedActions,
  seedCompanyApplications,
  seedRoles,
  seedRolePermissions,
  seedUserCompanies,
  seedSuppliers,
  seedDocumentTypes,
  seedReceptionTypes,
  seedReceptionOrigins,
  seedCompanySuppliers,
  seedReceptionTypeOrigins,
  seedSupplierReceptionOrigins,
  seedAnalysisTypes,
  seedCountries,
  seedDepartments,
  seedCities,
  seedMeasurementUnits,
  seedMineTypes,
  seedSupplierMiningTitles,
  seedStatus,
} from './seed/index';

// Inicializar cliente Prisma
const prisma = new PrismaClient();
const logger = new Logger('DatabaseSeed');

// Función principal de sembrado
async function main() {
  try {
    logger.log('🌱 Iniciando proceso de sembrado de datos...');

    // Ejecutar semillas en orden
    // Semillas para configurar el sistema
    await seedCountries(prisma);
    await seedDepartments(prisma);
    await seedCities(prisma);
    await seedApplications(prisma); // Primero las aplicaciones
    await seedCompanies(prisma); // Después las compañías
    await seedCompanyApplications(prisma); // Relaciones entre compañías y aplicaciones
    await seedUsers(prisma); // Luego los usuarios
    await seedRoles(prisma); // Roles
    await seedUserCompanies(prisma); // Relaciones entre usuarios, compañías y roles
    await seedActions(prisma); // Acciones para permisos
    await seedResources(prisma); // Después los recursos, ahora ya asociados directamente a sus aplicaciones
    await seedSubresources(prisma); // Subrecursos que dependen de recursos
    await seedRolePermissions(prisma); // Permisos de roles (debe ejecutarse al final)

    // Semillas para configurar laboratorio
    await seedMeasurementUnits(prisma); // Unidades de medida
    await seedDocumentTypes(prisma); // Tipos de documento (debe ir antes de proveedores)
    await seedSuppliers(prisma); // Proveedores
    await seedCompanySuppliers(prisma); // Relaciones entre compañías y proveedores (debe ir después de proveedores y compañías)
    await seedMineTypes(prisma); // Tipos de mina
    await seedSupplierMiningTitles(prisma); // Títulos mineros de proveedores
    await seedReceptionTypes(prisma); // Tipos de recepción
    await seedReceptionOrigins(prisma); // Orígenes de recepción
    await seedReceptionTypeOrigins(prisma); // Relaciones entre tipos y orígenes de recepción
    await seedSupplierReceptionOrigins(prisma); // Relaciones entre proveedores y orígenes de recepción
    await seedAnalysisTypes(prisma); // Tipos de análisis
    await seedStatus(prisma); // Estados

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
