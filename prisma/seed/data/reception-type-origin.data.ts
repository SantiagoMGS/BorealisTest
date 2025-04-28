import { Prisma } from '@prisma/client';

export const receptionTypeOriginInitialData: Prisma.ReceptionTypeOriginCreateInput[] =
  [
    // Tipo de recepción: Doré
    {
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Minería de Subsistencia' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Veta Fundido' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Plata Fundida' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Joyería Desuso' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Joyería de Plata' },
      },
    },

    // Tipo de recepción: Muestra
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'COLA' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'CABEZA MOLINO' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'OVERFLOW' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'CONCENTRADO FLOTACION' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'MUESTRA DE MINA' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'BIG BAGS' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'SOLUCION LIQUIDA' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'SOLUCION BARREN' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'MUESTRA DE PATIO O PILA' },
      },
    },
    {
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'MUESTRA AMBIENTAL' },
      },
    },
  ];
