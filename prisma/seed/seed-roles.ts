import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  const roles = ['ADMIN', 'TECNICO', 'AUXILIAR'];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('🟢 Roles insertados');
}
