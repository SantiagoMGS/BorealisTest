import { Prisma } from '@prisma/client';

// Estructura que combina recepciones con sus dorés correspondientes
// Cada recepción tiene un array con los dorés que le pertenecen
export const doreReceptionData = [
  {
    // Recepción 1
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Sofia Rodriguez - Joyería' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Joyería Desuso' },
      },
      receptionDate: new Date('2025-04-05'),
      batchNumber: 'SOFIR-D-2025-1',
      observation: 'Piezas de joyería de oro para fundición, excelente calidad',
      cityName: 'MEDELLIN',
      isActive: true,
    },
    // 2 dorés para esta recepción
    dores: [
      {
        receivedWeight: 1250.75,
        finalWeight: 1200.5,
        goldLaw: 0.85,
        goldWeight: 1020.42,
        silverLaw: 0.12,
        silverWeight: 144.06,
        goldBalance: 1020.42,
        silverBalance: 144.06,
        approvedLaw: true,
        observation: 'Doré de joyería con alta pureza de oro',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 980.25,
        finalWeight: 950.8,
        goldLaw: 0.82,
        goldWeight: 779.66,
        silverLaw: 0.15,
        silverWeight: 142.62,
        goldBalance: 779.66,
        silverBalance: 142.62,
        approvedLaw: true,
        observation: 'Segunda pieza de doré de joyería, buena calidad',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 2
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Ana Gómez - Artesanías en Oro' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Joyería Desuso' },
      },
      receptionDate: new Date('2025-04-07'),
      batchNumber: 'ANAGO-D-2025-1',
      observation: 'Material de orfebrería con alto contenido de oro',
      cityName: 'CALI',
      isActive: true,
    },
    // 3 dorés para esta recepción
    dores: [
      {
        receivedWeight: 875.2,
        finalWeight: 850.1,
        goldLaw: 0.78,
        goldWeight: 663.08,
        silverLaw: 0.18,
        silverWeight: 153.02,
        goldBalance: 663.08,
        silverBalance: 153.02,
        approvedLaw: true,
        observation: 'Doré de artesanía con buen contenido de oro',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 732.5,
        finalWeight: 720.3,
        goldLaw: 0.76,
        goldWeight: 547.43,
        silverLaw: 0.2,
        silverWeight: 144.06,
        goldBalance: 547.43,
        silverBalance: 144.06,
        approvedLaw: true,
        observation: 'Doré de artesanía, calidad media',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 625.8,
        finalWeight: 610.2,
        goldLaw: 0.81,
        goldWeight: 494.26,
        silverLaw: 0.16,
        silverWeight: 97.63,
        goldBalance: 494.26,
        silverBalance: 97.63,
        approvedLaw: true,
        observation: 'Doré de artesanía con alta ley de oro',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 3
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Minerales del Caribe S.A.' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Veta Fundido' },
      },
      receptionDate: new Date('2025-04-10'),
      batchNumber: 'MINER-D-2025-1',
      observation: 'Lingote con alto porcentaje de plata y oro',
      cityName: 'CARTAGENA',
      miningTitle: {
        connect: { name: 'KLM-2021' },
      },
      isActive: true,
    },
    // 1 doré para esta recepción
    dores: [
      {
        receivedWeight: 2100.0,
        finalWeight: 2080.5,
        goldLaw: 0.65,
        goldWeight: 1352.33,
        silverLaw: 0.3,
        silverWeight: 624.15,
        goldBalance: 1352.33,
        silverBalance: 624.15,
        approvedLaw: true,
        observation: 'Lingote de mina con buena concentración',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 4
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Consorcio Minero Andino' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Minería de Subsistencia' },
      },
      receptionDate: new Date('2025-04-12'),
      batchNumber: 'CONMA-D-2025-1',
      observation: 'Material extraído de mina subterránea, contenido mixto',
      cityName: 'BURITICA',
      miningTitle: {
        connect: { name: 'PQR-780' },
      },
      isActive: true,
    },
    // 1 doré para esta recepción
    dores: [
      {
        receivedWeight: 1500.3,
        finalWeight: 1480.2,
        goldLaw: 0.72,
        goldWeight: 1065.74,
        silverLaw: 0.2,
        silverWeight: 296.04,
        goldBalance: 1065.74,
        silverBalance: 296.04,
        approvedLaw: true,
        observation: 'Material minero de buena calidad',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 5
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Inversiones Mineras del Sur' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Veta Fundido' },
      },
      receptionDate: new Date('2025-04-15'),
      batchNumber: 'INVMS-D-2025-1',
      observation: 'Lingote fundido con alta concentración de oro',
      cityName: 'PASTO',
      miningTitle: {
        connect: { name: 'ZXY-42A' },
      },
      isActive: true,
    },
    // 2 dorés para esta recepción
    dores: [
      {
        receivedWeight: 1850.0,
        finalWeight: 1820.75,
        goldLaw: 0.8,
        goldWeight: 1456.6,
        silverLaw: 0.15,
        silverWeight: 273.11,
        goldBalance: 1456.6,
        silverBalance: 273.11,
        approvedLaw: true,
        observation: 'Lingote de alta pureza',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 1420.5,
        finalWeight: 1400.0,
        goldLaw: 0.78,
        goldWeight: 1092.0,
        silverLaw: 0.18,
        silverWeight: 252.0,
        goldBalance: 1092.0,
        silverBalance: 252.0,
        approvedLaw: true,
        observation: 'Segundo lingote de buena ley',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 6
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Refinería Nacional de Metales S.A.' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Plata Fundida' },
      },
      receptionDate: new Date('2025-04-18'),
      batchNumber: 'REFIN-D-2025-1',
      observation: 'Plata refinada de alta pureza',
      cityName: 'BOGOTA, D.C.',
      isActive: true,
    },
    // 3 dorés para esta recepción
    dores: [
      {
        receivedWeight: 900.5,
        finalWeight: 890.3,
        goldLaw: 0.15,
        goldWeight: 133.55,
        silverLaw: 0.82,
        silverWeight: 730.05,
        goldBalance: 133.55,
        silverBalance: 730.05,
        approvedLaw: true,
        observation: 'Material principalmente de plata',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 875.25,
        finalWeight: 860.5,
        goldLaw: 0.18,
        goldWeight: 154.89,
        silverLaw: 0.79,
        silverWeight: 679.8,
        goldBalance: 154.89,
        silverBalance: 679.8,
        approvedLaw: true,
        observation: 'Segundo lingote con alto contenido de plata',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 920.8,
        finalWeight: 910.2,
        goldLaw: 0.12,
        goldWeight: 109.22,
        silverLaw: 0.84,
        silverWeight: 764.57,
        goldBalance: 109.22,
        silverBalance: 764.57,
        approvedLaw: true,
        observation: 'Tercer lingote de plata con trazas de oro',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 7
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Artesanos Unidos del Oro Ltda.' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Joyería Desuso' },
      },
      receptionDate: new Date('2025-04-20'),
      batchNumber: 'ARTES-D-2025-1',
      observation: 'Piezas de joyería de oro antiguas para refundición',
      cityName: 'CALI',
      isActive: true,
    },
    // 2 dorés para esta recepción
    dores: [
      {
        receivedWeight: 750.25,
        finalWeight: 730.6,
        goldLaw: 0.81,
        goldWeight: 591.79,
        silverLaw: 0.1,
        silverWeight: 73.06,
        goldBalance: 591.79,
        silverBalance: 73.06,
        approvedLaw: true,
        observation: 'Joyería antigua con alto contenido de oro',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 680.5,
        finalWeight: 670.25,
        goldLaw: 0.78,
        goldWeight: 522.8,
        silverLaw: 0.15,
        silverWeight: 100.54,
        goldBalance: 522.8,
        silverBalance: 100.54,
        approvedLaw: true,
        observation: 'Segunda remesa de joyería antigua',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 8
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Fundición Metales Preciosos S.A.S' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Veta Fundido' },
      },
      receptionDate: new Date('2025-04-22'),
      batchNumber: 'FUNMP-D-2025-1',
      observation: 'Lingote de oro con aleación de plata',
      cityName: 'MEDELLIN',
      isActive: true,
    },
    // 1 doré para esta recepción
    dores: [
      {
        receivedWeight: 2250.0,
        finalWeight: 2200.5,
        goldLaw: 0.7,
        goldWeight: 1540.35,
        silverLaw: 0.25,
        silverWeight: 550.13,
        goldBalance: 1540.35,
        silverBalance: 550.13,
        approvedLaw: true,
        observation: 'Lingote con buena proporción de oro y plata',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 9
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Ricardo Mendoza - Metalurgia Artesanal' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Minería de Subsistencia' },
      },
      receptionDate: new Date('2025-04-24'),
      batchNumber: 'RICAR-D-2025-1',
      observation: 'Oro extraído mediante técnicas artesanales',
      cityName: 'POPAYAN',
      isActive: true,
    },
    // 2 dorés para esta recepción
    dores: [
      {
        receivedWeight: 650.75,
        finalWeight: 630.2,
        goldLaw: 0.75,
        goldWeight: 472.65,
        silverLaw: 0.18,
        silverWeight: 113.44,
        goldBalance: 472.65,
        silverBalance: 113.44,
        approvedLaw: true,
        observation: 'Material artesanal con buena ley',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 580.5,
        finalWeight: 570.25,
        goldLaw: 0.72,
        goldWeight: 410.58,
        silverLaw: 0.2,
        silverWeight: 114.05,
        goldBalance: 410.58,
        silverBalance: 114.05,
        approvedLaw: true,
        observation: 'Segunda muestra de minería artesanal',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
  {
    // Recepción 10
    reception: {
      company: {
        connect: { name: 'COLOMBIAN MINT' },
      },
      supplier: {
        connect: { name: 'Oro Puro Internacional Ltda.' },
      },
      receptionType: {
        connect: { name: 'Doré' },
      },
      receptionOrigin: {
        connect: { name: 'Plata Fundida' },
      },
      receptionDate: new Date('2025-04-28'),
      batchNumber: 'OROPI-D-2025-1',
      observation: 'Lingote fundido de plata con trazas de oro',
      cityName: 'BOGOTA, D.C.',
      isActive: true,
    },
    // 3 dorés para esta recepción
    dores: [
      {
        receivedWeight: 1200.0,
        finalWeight: 1180.5,
        goldLaw: 0.2,
        goldWeight: 236.1,
        silverLaw: 0.75,
        silverWeight: 885.38,
        goldBalance: 236.1,
        silverBalance: 885.38,
        approvedLaw: true,
        observation: 'Material predominantemente de plata con trazas de oro',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 980.5,
        finalWeight: 960.25,
        goldLaw: 0.25,
        goldWeight: 240.06,
        silverLaw: 0.7,
        silverWeight: 672.18,
        goldBalance: 240.06,
        silverBalance: 672.18,
        approvedLaw: true,
        observation: 'Segundo lingote de plata con mejor contenido de oro',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
      {
        receivedWeight: 1050.75,
        finalWeight: 1030.5,
        goldLaw: 0.18,
        goldWeight: 185.49,
        silverLaw: 0.78,
        silverWeight: 803.79,
        goldBalance: 185.49,
        silverBalance: 803.79,
        approvedLaw: true,
        observation: 'Tercer lingote con mayor contenido de plata',
        base64: 'data:image/jpeg;base64,/9j/example-base64-data',
        format: 'image/jpeg',
        status: { connect: { name: 'RECIBIDO' } },
      },
    ],
  },
];

// Funciones auxiliares para extraer los datos para compatibilidad con código existente
export const doreReceptionInitialData = doreReceptionData.map(
  (item) => item.reception,
);
export const doreInitialData = doreReceptionData.flatMap((item) => item.dores);
