import { Prisma } from '@prisma/client';

/**
 * Datos iniciales para impresoras
 * Estos registros se crearán cuando se ejecute el comando de semilla
 * Requisitos:
 * - La combinación de companyId e ip debe ser única
 */
export const printerInitialData: Prisma.PrinterCreateInput[] = [
  // Impresora 1: Impresora de Recepción
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

  // Impresora 2: Impresora de Laboratorio
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

  // Impresora 3: Impresora de Almacén
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

  // Impresora 4: Impresora de Backup (inactiva)
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

/**
 * IMPORTANTE: Antes de usar este archivo en producción, se recomienda:
 * 1. Actualizar los IDs de compañía con valores reales existentes en la base de datos
 * 2. Ajustar las direcciones IP y puertos según la configuración de red real
 * 3. Verificar que los nombres y ubicaciones sean apropiados para el entorno
 */
