import { Prisma } from '@prisma/client';

export const printerInitialData: Prisma.PrinterCreateInput[] = [
  {
    company: {
      connect: {
        name: 'QUINTANA',
      },
    },
    ip: '192.168.1.100',
    port: '9100',
    location: 'Área de Recepción',
    printerName: 'Impresora de Recepción',
    isActive: true,
  },

  {
    company: {
      connect: {
        name: 'QUINTANA',
      },
    },
    ip: '192.168.1.101',
    port: '9100',
    location: 'Laboratorio Principal',
    printerName: 'Impresora de Laboratorio',
    isActive: true,
  },

  {
    company: {
      connect: {
        name: 'COLOMBIAN MINT',
      },
    },
    ip: '192.168.1.102',
    port: '9100',
    location: 'Almacén de Muestras',
    printerName: 'Impresora de Almacén',
    isActive: true,
  },

  {
    company: {
      connect: {
        // Usa un ID existente de compañía
        name: 'COLOMBIAN MINT',
      },
    },
    ip: '192.168.1.103',
    port: '9100',
    location: 'Oficina de Reserva',
    printerName: 'Impresora de Backup',
    isActive: false,
  },
];
