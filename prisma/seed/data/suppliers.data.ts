import { Prisma } from '@prisma/client';

export const supplierInitialData: Prisma.SupplierCreateInput[] = [
  {
    name: 'Minería Los Andes S.A.S',
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
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '901789456',
    verificationDigit: '3',
  },
];
