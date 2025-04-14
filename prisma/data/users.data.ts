import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Función para hashear contraseñas
const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const userInitialData: Prisma.UserCreateInput[] = [
  {
    name: 'Administrador',
    email: 'admin@borealis.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
  {
    name: 'Técnico Demo',
    email: 'tecnico@borealis.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
  {
    name: 'Auxiliar Demo',
    email: 'auxiliar@borealis.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
]; 