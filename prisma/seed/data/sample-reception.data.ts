import { Prisma } from '@prisma/client';

export const sampleReceptionData = [
  {
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Minería Los Andes S.A.S' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-05'),
      batchNumber: 'MINER-M-2025-1',
      observation:
        'Muestras de material de cola con contenido metálico residual',
      cityName: 'MEDELLIN',
      isActive: true,
    },
    samples: [
      {
        receivedWeight: 750.25,
        code: 10001,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'COLA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 825.5,
        code: 10002,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'COLA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Carlos Pérez - Minero Independiente' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-07'),
      batchNumber: 'CARLP-M-2025-1',
      observation: 'Material de exploración minera para análisis',
      cityName: 'QUIBDO',
      isActive: true,
    },
    samples: [
      {
        receivedWeight: 350.75,
        code: 10003,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Cooperativa Minera del Pacífico' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-10'),
      batchNumber: 'COOPA-M-2025-1',
      observation:
        'Concentrado de flotación para análisis de contenido de oro y plata',
      cityName: 'BUENAVENTURA',
      isActive: true,
    },
    samples: [
      {
        receivedWeight: 420.3,
        code: 10004,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'CONCENTRADO FLOTACION' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 450.8,
        code: 10005,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'CONCENTRADO FLOTACION' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 480.5,
        code: 10006,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'CONCENTRADO FLOTACION' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Extracción Minerales del Cauca' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionOrigin: {
        connect: { name: 'CABEZA MOLINO' },
      },
      receptionDate: new Date('2025-05-12'),
      batchNumber: 'EXTRA-M-2025-1',
      observation:
        'Material de cabeza de molino para evaluación de contenido metálico',
      cityName: 'POPAYAN',
      isActive: true,
    },
    samples: [
      {
        receivedWeight: 680.25,
        code: 10007,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'CABEZA MOLINO' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 720.5,
        code: 10008,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'CABEZA MOLINO' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Minerales del Valle S.A.S' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },

      receptionDate: new Date('2025-05-15'),
      batchNumber: 'MINER-M-2025-2',
      observation: 'Colas de proceso para verificación de pérdidas metálicas',
      cityName: 'CALI',

      isActive: true,
    },
    samples: [
      {
        receivedWeight: 950.75,
        code: 10009,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'COLA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Consorcio Minero Andino' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-18'),
      batchNumber: 'CONMA-M-2025-1',
      observation:
        'Muestras directas de mina para evaluación de potencial aurífero',
      cityName: 'MEDELLIN',
      isActive: true,
    },
    samples: [
      {
        receivedWeight: 350.3,
        code: 10010,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 380.5,
        code: 10011,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 420.75,
        code: 10012,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 390.2,
        code: 10013,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    // Recepción 7
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Exportadora de Metales Preciosos Ltda.' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-20'),
      batchNumber: 'EXPOR-M-2025-1',
      observation: 'Material excedente de circuitos de molienda para análisis',
      cityName: 'BOGOTA, D.C.',
      isActive: true,
    },
    // 2 muestras para esta recepción
    samples: [
      {
        receivedWeight: 250.15,
        code: 10014,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'OVERFLOW' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 280.35,
        code: 10015,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'OVERFLOW' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    // Recepción 8
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Juan Martínez - Minero Artesanal' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-22'),
      batchNumber: 'JUANM-M-2025-1',
      observation: 'Especímenes para análisis de contenido de oro',
      cityName: 'CAUCASIA',
      isActive: true,
    },
    // 1 muestra para esta recepción
    samples: [
      {
        receivedWeight: 180.5,
        code: 10016,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    // Recepción 9
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Asociación Minera del Chocó' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-24'),
      batchNumber: 'ASOMI-M-2025-1',
      observation: 'Muestras de exploración minera para análisis de potencial',
      cityName: 'QUIBDO',
      isActive: true,
    },
    // 3 muestras para esta recepción
    samples: [
      {
        receivedWeight: 520.3,
        code: 10017,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 480.5,
        code: 10018,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 540.7,
        code: 10019,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'MUESTRA DE MINA' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
    ],
  },
  {
    // Recepción 10
    reception: {
      company: {
        connect: { name: 'QUINTANA' },
      },
      supplier: {
        connect: { name: 'Gold Mining International Corp.' },
      },
      receptionType: {
        connect: { name: 'Muestra' },
      },
      receptionDate: new Date('2025-05-28'),
      batchNumber: 'GOLDM-M-2025-1',
      observation:
        'Material excedente de procesos de clasificación para evaluación',
      cityName: 'CALI',
      isActive: true,
    },
    // 2 muestras para esta recepción
    samples: [
      {
        receivedWeight: 1200.5,
        code: 10020,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'OVERFLOW' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'ABSORCION ATOMIC' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
      {
        receivedWeight: 1350.75,
        code: 10021,
        status: { connect: { name: 'RECIBIDO' } },
        receptionOrigin: {
          connect: { name: 'OVERFLOW' },
        },
        requiredAnalyses: [
          {
            analysisType: {
              connect: { name: 'LEACHWELL' },
            },
            done: false,
          },
          {
            analysisType: {
              connect: { name: 'DETERMINACION DE HUMEDAD' },
            },
            done: false,
          },
        ],
      },
    ],
  },
];

// Funciones auxiliares para extraer los datos para compatibilidad con código existente
export const sampleReceptionInitialData = sampleReceptionData.map(
  (item) => item.reception,
);
export const sampleInitialData = sampleReceptionData.flatMap(
  (item) => item.samples,
);
