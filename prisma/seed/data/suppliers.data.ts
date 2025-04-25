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
];
