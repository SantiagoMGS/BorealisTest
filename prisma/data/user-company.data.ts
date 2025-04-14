import { Prisma } from '@prisma/client';

// Este objeto será completado en el seed, ya que necesita IDs existentes
export const userCompanyInitialData: Partial<Prisma.UserCompanyCreateManyInput>[] = [
  {
    // Admin en QUINTANA como SUPERADMIN
    userId: '', // Se completará en el seed
    companyId: '', // Se completará en el seed
    roleId: '', // Se completará en el seed
    isActive: true,
  },
  {
    // Admin en MONA MINAS como ADMIN
    userId: '', // Se completará en el seed
    companyId: '', // Se completará en el seed
    roleId: '', // Se completará en el seed
    isActive: true,
  },
  {
    // Técnico en QUINTANA como TECNICO
    userId: '', // Se completará en el seed
    companyId: '', // Se completará en el seed
    roleId: '', // Se completará en el seed
    isActive: true,
  },
  {
    // Auxiliar en COLOMBIAN MINT como AUXILIAR
    userId: '', // Se completará en el seed
    companyId: '', // Se completará en el seed
    roleId: '', // Se completará en el seed
    isActive: true,
  },
]; 