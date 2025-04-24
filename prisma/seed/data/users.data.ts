import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Función para hashear contraseñas
const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const userInitialData: Prisma.UserCreateInput[] = [
  {
    name: 'Super Administrador',
    email: 'superadmin@borealis.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
  {
    name: 'Admin Quintana',
    email: 'admin@quintana.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
  {
    name: 'Admin Mona Minas',
    email: 'admin@monaminas.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
  {
    name: 'Admin Colombian Mint',
    email: 'admin@colombianmint.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
  {
    name: 'Auxiliar Demo',
    email: 'auxiliar@quintana.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
  {
    name: 'Jefe Laboratorio Demo',
    email: 'jefelaboratorio@quintana.com',
    hashedPassword: hashPassword('Borealis2025'),
    isActive: true,
  },
];
