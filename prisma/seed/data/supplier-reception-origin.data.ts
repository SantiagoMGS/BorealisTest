import { Prisma } from '@prisma/client';

type SupplierOriginSeed = {
  supplierName: string;
  originName: string;
};

export const supplierReceptionOriginInitialData: SupplierOriginSeed[] = [
  // Consorcio Minero Andino - 2 orígenes
  {
    supplierName: 'Consorcio Minero Andino',
    originName: 'Minería de Subsistencia',
  },
  { supplierName: 'Consorcio Minero Andino', originName: 'Veta Fundido' },

  // Gold Mining International Corp. - 3 orígenes
  {
    supplierName: 'Gold Mining International Corp.',
    originName: 'Minería de Subsistencia',
  },
  {
    supplierName: 'Gold Mining International Corp.',
    originName: 'Veta Fundido',
  },
  {
    supplierName: 'Gold Mining International Corp.',
    originName: 'Plata Fundida',
  },

  // Sofia Rodriguez - Joyería - 2 orígenes
  { supplierName: 'Sofia Rodriguez - Joyería', originName: 'Joyería Desuso' },
  { supplierName: 'Sofia Rodriguez - Joyería', originName: 'Joyería de Plata' },

  // Ana Gómez - Artesanías en Oro - 2 orígenes
  {
    supplierName: 'Ana Gómez - Artesanías en Oro',
    originName: 'Joyería Desuso',
  },
  {
    supplierName: 'Ana Gómez - Artesanías en Oro',
    originName: 'Minería de Subsistencia',
  },

  // Minerales del Caribe S.A. - 2 orígenes
  { supplierName: 'Minerales del Caribe S.A.', originName: 'Veta Fundido' },
  { supplierName: 'Minerales del Caribe S.A.', originName: 'Plata Fundida' },

  // Cooperativa Minera de Antioquia - 1 origen
  {
    supplierName: 'Cooperativa Minera de Antioquia',
    originName: 'Minería de Subsistencia',
  },

  // Inversiones Mineras del Sur - 2 orígenes
  { supplierName: 'Inversiones Mineras del Sur', originName: 'Veta Fundido' },
  {
    supplierName: 'Inversiones Mineras del Sur',
    originName: 'Minería de Subsistencia',
  },

  // Refinería Nacional de Metales S.A. - 3 orígenes
  {
    supplierName: 'Refinería Nacional de Metales S.A.',
    originName: 'Minería de Subsistencia',
  },
  {
    supplierName: 'Refinería Nacional de Metales S.A.',
    originName: 'Veta Fundido',
  },
  {
    supplierName: 'Refinería Nacional de Metales S.A.',
    originName: 'Plata Fundida',
  },

  // Artesanos Unidos del Oro Ltda. - 3 orígenes
  {
    supplierName: 'Artesanos Unidos del Oro Ltda.',
    originName: 'Joyería Desuso',
  },
  {
    supplierName: 'Artesanos Unidos del Oro Ltda.',
    originName: 'Joyería de Plata',
  },
  {
    supplierName: 'Artesanos Unidos del Oro Ltda.',
    originName: 'Minería de Subsistencia',
  },

  // Gabriela Martínez - Importadora de Joyería - 2 orígenes
  {
    supplierName: 'Gabriela Martínez - Importadora de Joyería',
    originName: 'Joyería Desuso',
  },
  {
    supplierName: 'Gabriela Martínez - Importadora de Joyería',
    originName: 'Joyería de Plata',
  },

  // Inversiones Mineras El Dorado S.A.S - 1 origen
  {
    supplierName: 'Inversiones Mineras El Dorado S.A.S',
    originName: 'Minería de Subsistencia',
  },

  // Andrés Suárez - Comerciante de Metales - 3 orígenes
  {
    supplierName: 'Andrés Suárez - Comerciante de Metales',
    originName: 'Joyería Desuso',
  },
  {
    supplierName: 'Andrés Suárez - Comerciante de Metales',
    originName: 'Veta Fundido',
  },
  {
    supplierName: 'Andrés Suárez - Comerciante de Metales',
    originName: 'Plata Fundida',
  },

  // Mineros del Amazonas S.A. - 2 orígenes
  {
    supplierName: 'Mineros del Amazonas S.A.',
    originName: 'Minería de Subsistencia',
  },
  { supplierName: 'Mineros del Amazonas S.A.', originName: 'Veta Fundido' },

  // Alejandra Rojas - Diseñadora de Joyas - 2 orígenes
  {
    supplierName: 'Alejandra Rojas - Diseñadora de Joyas',
    originName: 'Joyería Desuso',
  },
  {
    supplierName: 'Alejandra Rojas - Diseñadora de Joyas',
    originName: 'Joyería de Plata',
  },

  // Fundición Metales Preciosos S.A.S - 3 orígenes
  {
    supplierName: 'Fundición Metales Preciosos S.A.S',
    originName: 'Veta Fundido',
  },
  {
    supplierName: 'Fundición Metales Preciosos S.A.S',
    originName: 'Plata Fundida',
  },
  {
    supplierName: 'Fundición Metales Preciosos S.A.S',
    originName: 'Minería de Subsistencia',
  },

  // Ricardo Mendoza - Metalurgia Artesanal - 1 origen
  {
    supplierName: 'Ricardo Mendoza - Metalurgia Artesanal',
    originName: 'Minería de Subsistencia',
  },

  // Oro Puro Internacional Ltda. - 2 orígenes
  { supplierName: 'Oro Puro Internacional Ltda.', originName: 'Veta Fundido' },
  {
    supplierName: 'Oro Puro Internacional Ltda.',
    originName: 'Minería de Subsistencia',
  },
];
