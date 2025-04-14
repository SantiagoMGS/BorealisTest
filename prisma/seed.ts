// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import {
  seedActions,
  seedApplicationResources,
  seedApplications,
  seedCompanies,
  seedCompanyApplications,
  seedResources,
  seedRolePermissions,
  seedRoles,
  seedSubresources,
  seedUserCompanies,
  seedUsers
} from './seed/';

// Determinar el nivel de verbosidad desde los argumentos o variables de entorno
const verboseLogging =
  process.argv.includes('--verbose') || process.env.PRISMA_VERBOSE === 'true';

// Crear instancia de Prisma con configuración de logging controlada
const prisma = new PrismaClient({
  log: verboseLogging
    ? [
        { level: 'query', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ]
    : [{ level: 'error', emit: 'stdout' }], // Solo mostramos errores en modo no verbose
});

/**
 * Función principal de seed que ejecuta todos los seeders
 * en el orden correcto respetando las dependencias entre entidades
 */
async function main() {
  try {
    console.log('🌱 Iniciando proceso de seed...');

    // Ejecutamos seeds en orden secuencial para respetar dependencias
    // 1. Primero las entidades base
    await seedRoles(prisma);
    await seedCompanies(prisma);
    await seedApplications(prisma);
    await seedActions(prisma);
    await seedResources(prisma);
    
    // 2. Luego las entidades dependientes
    await seedSubresources(prisma);
    await seedUsers(prisma);
    
    // 3. Finalmente las relaciones
    await seedUserCompanies(prisma);
    await seedRolePermissions(prisma);
    await seedCompanyApplications(prisma);
    await seedApplicationResources(prisma);

    console.log('✅ Proceso de seed completado con éxito');
  } catch (error) {
    console.error('❌ Error durante el proceso de seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar función principal
main();
