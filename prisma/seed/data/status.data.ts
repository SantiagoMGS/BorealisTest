import { Status } from '@prisma/client';

export const statusData: Omit<Status, 'id'>[] = [
  {
    name: 'ENVIADO',
    isActive: true,
  },
  {
    name: 'RECIBIDO',
    isActive: true,
  },
  {
    name: 'EN_ANALISIS',
    isActive: true,
  },
  {
    name: 'CANCELADO',
    isActive: true,
  },
];

export const getStatusData = (): Omit<Status, 'id'>[] => {
  return statusData;
};
