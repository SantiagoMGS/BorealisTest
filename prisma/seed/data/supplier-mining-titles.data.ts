import { Prisma } from '@prisma/client';

export const supplierMiningTitleInitialData = [
  {
    name: '014-89M',
    supplier: {
      connect: {
        name: 'Minería Los Andes S.A.S',
      },
    },
    mineType: {
      connect: {
        name: 'Aluvial',
      },
    },
    city: {
      connect: {
        name: 'MEDELLIN',
        daneCode: '001',
        department: {
          name: 'ANTIOQUIA',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'SF_15',
    supplier: {
      connect: {
        name: 'Carlos Pérez - Minero Independiente',
      },
    },
    mineType: {
      connect: {
        name: 'Socavón',
      },
    },
    city: {
      connect: {
        name: 'AMALFI',
        daneCode: '031',
        department: {
          name: 'ANTIOQUIA',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'HJID-03',
    supplier: {
      connect: {
        name: 'Cooperativa Minera del Pacífico',
      },
    },
    mineType: {
      connect: {
        name: 'Aluvial',
      },
    },
    city: {
      connect: {
        name: 'BUENAVENTURA',
        daneCode: '109',
        department: {
          name: 'VALLE DEL CAUCA',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'H6388005',
    supplier: {
      connect: {
        name: 'Extracción Minerales del Cauca',
      },
    },
    mineType: {
      connect: {
        name: 'Socavón',
      },
    },
    city: {
      connect: {
        name: 'POPAYAN',
        daneCode: '001',
        department: {
          name: 'CAUCA',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'T1092005',
    supplier: {
      connect: {
        name: 'Minerales del Valle S.A.S',
      },
    },
    mineType: {
      connect: {
        name: 'Aluvial',
      },
    },
    city: {
      connect: {
        name: 'CALI',
        daneCode: '001',
        department: {
          name: 'VALLE DEL CAUCA',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'HFS-15091X',
    supplier: {
      connect: {
        name: 'Juan Martínez - Minero Artesanal',
      },
    },
    mineType: {
      connect: {
        name: 'Socavón',
      },
    },
    city: {
      connect: {
        name: 'ANORI',
        daneCode: '040',
        department: {
          name: 'ANTIOQUIA',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'ILD14271',
    supplier: {
      connect: {
        name: 'Asociación Minera del Chocó',
      },
    },
    mineType: {
      connect: {
        name: 'Aluvial',
      },
    },
    city: {
      connect: {
        name: 'QUIBDO',
        daneCode: '001',
        department: {
          name: 'CHOCO',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'KLM-2021',
    supplier: {
      connect: {
        name: 'Minerales del Caribe S.A.',
      },
    },
    mineType: {
      connect: {
        name: 'Aluvial',
      },
    },
    city: {
      connect: {
        name: 'CARTAGENA',
        daneCode: '001',
        department: {
          name: 'BOLIVAR',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'PQR-780',
    supplier: {
      connect: {
        name: 'Consorcio Minero Andino',
      },
    },
    mineType: {
      connect: {
        name: 'Socavón',
      },
    },
    city: {
      connect: {
        name: 'BURITICA',
        daneCode: '113',
        department: {
          name: 'ANTIOQUIA',
        },
      },
    },
    isActive: true,
  },
  {
    name: 'ZXY-42A',
    supplier: {
      connect: {
        name: 'Inversiones Mineras del Sur',
      },
    },
    mineType: {
      connect: {
        name: 'Aluvial',
      },
    },
    city: {
      connect: {
        name: 'PASTO',
        daneCode: '001',
        department: {
          name: 'NARIÑO',
        },
      },
    },
    isActive: true,
  },
];
