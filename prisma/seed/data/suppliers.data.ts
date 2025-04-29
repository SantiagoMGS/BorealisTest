import { Prisma } from '@prisma/client';

export const supplierInitialData: Prisma.SupplierCreateInput[] = [
  {
    name: 'Minería Los Andes S.A.S',
    shortName: 'MLA',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    verificationDigit: '7',
    documentNumber: '900123456',
  },
  {
    name: 'Carlos Pérez - Minero Independiente',
    shortName: 'CP-MI',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    verificationDigit: '',
    documentNumber: '79856234',
  },
  {
    name: 'Cooperativa Minera del Pacífico',
    shortName: 'CMP',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    verificationDigit: '9',
    documentNumber: '812345678',
  },
  {
    name: 'Extracción Minerales del Cauca',
    shortName: 'EMC',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '860234567',
    verificationDigit: '1',
  },
  {
    name: 'Sofia Rodriguez - Joyería',
    shortName: 'SR-J',
    documentType: {
      connect: {
        code: 'CE',
      },
    },
    documentNumber: '52436789',
    verificationDigit: '',
  },
  {
    name: 'Minerales del Valle S.A.S',
    shortName: 'MDV',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '901567832',
    verificationDigit: '3',
  },
  {
    name: 'Ana Gómez - Artesanías en Oro',
    shortName: 'AG-AO',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '43218765',
    verificationDigit: '',
  },
  {
    name: 'Exportadora de Metales Preciosos Ltda.',
    shortName: 'EMP',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '830456789',
    verificationDigit: '5',
  },
  {
    name: 'Juan Martínez - Minero Artesanal',
    shortName: 'JM-MA',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '80765432',
    verificationDigit: '',
  },
  {
    name: 'Asociación Minera del Chocó',
    shortName: 'AMC',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '900876543',
    verificationDigit: '2',
  },
  {
    name: 'Minerales del Caribe S.A.',
    shortName: 'MDC',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '825678901',
    verificationDigit: '8',
  },
  {
    name: 'Luisa Fernández - Joyería Artesanal',
    shortName: 'LF-JA',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '52987654',
    verificationDigit: '',
  },
  {
    name: 'Consorcio Minero Andino',
    shortName: 'CMA',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '845678123',
    verificationDigit: '4',
  },
  {
    name: 'Pedro Ramírez - Comerciante de Oro',
    shortName: 'PR-CO',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '71234567',
    verificationDigit: '',
  },
  {
    name: 'Gold Mining International Corp.',
    shortName: 'GMIC',
    documentType: {
      connect: {
        code: 'CE',
      },
    },
    documentNumber: '345678912',
    verificationDigit: '',
  },
  {
    name: 'Cooperativa Minera de Antioquia',
    shortName: 'CMA2',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '811234987',
    verificationDigit: '6',
  },
  {
    name: 'María Valencia - Procesadora de Minerales',
    shortName: 'MV-PM',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '40123789',
    verificationDigit: '',
  },
  {
    name: 'Inversiones Mineras del Sur',
    shortName: 'IMS',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '900345671',
    verificationDigit: '9',
  },
  {
    name: 'Diego Torres - Exportador Independiente',
    shortName: 'DT-EI',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '79123456',
    verificationDigit: '',
  },
  {
    name: 'Metales y Aleaciones S.A.S',
    shortName: 'MYA',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '901789456',
    verificationDigit: '3',
  },
  {
    name: 'Refinería Nacional de Metales S.A.',
    shortName: 'RNM',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '900456123',
    verificationDigit: '5',
  },
  {
    name: 'Artesanos Unidos del Oro Ltda.',
    shortName: 'AUO',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '823789654',
    verificationDigit: '2',
  },
  {
    name: 'Gabriela Martínez - Importadora de Joyería',
    shortName: 'GM-IJ',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '43567891',
    verificationDigit: '',
  },
  {
    name: 'Inversiones Mineras El Dorado S.A.S',
    shortName: 'IMED',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '901234789',
    verificationDigit: '7',
  },
  {
    name: 'Andrés Suárez - Comerciante de Metales',
    shortName: 'AS-CM',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '80234567',
    verificationDigit: '',
  },
  {
    name: 'Mineros del Amazonas S.A.',
    shortName: 'MDA',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '890456123',
    verificationDigit: '8',
  },
  {
    name: 'Alejandra Rojas - Diseñadora de Joyas',
    shortName: 'AR-DJ',
    documentType: {
      connect: {
        code: 'CE',
      },
    },
    documentNumber: '53789412',
    verificationDigit: '',
  },
  {
    name: 'Fundición Metales Preciosos S.A.S',
    shortName: 'FMP',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '901654321',
    verificationDigit: '4',
  },
  {
    name: 'Ricardo Mendoza - Metalurgia Artesanal',
    shortName: 'RM-MA',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '72345678',
    verificationDigit: '',
  },
  {
    name: 'Oro Puro Internacional Ltda.',
    shortName: 'OPI',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '830987654',
    verificationDigit: '1',
  },
];
