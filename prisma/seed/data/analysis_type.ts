import { Prisma } from '@prisma/client';

type AnalysisTypeData = {
  name: string;
  shortName: string;
  description?: string | null;
  isActive?: boolean;
  analysisResult?: {
    type: string;
    properties: {
      value: { type: string };
      unit: { type: string };
    };
  };
};

export const analysisTypeInitialData: AnalysisTypeData[] = [
  {
    name: 'XRF',
    shortName: 'XRF',
    description:
      'Análisis por fluorescencia de rayos X para identificación rápida de elementos',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'ABSORCION ATOMIC',
    shortName: 'AA',
    description:
      'Análisis por absorción atómica para determinar elementos químicos',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'ENSAYO AL FUEGO',
    shortName: 'EF',
    description: 'Método clásico de ensayo al fuego para metales preciosos',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'GRANULOMETRICO',
    shortName: 'G',
    description:
      'Análisis granulométrico para determinar la distribución de tamaños de partícula',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'MALLAS VALORADAS',
    shortName: 'MV',
    description:
      'Análisis por mallas valoradas para determinar la distribución de valores por tamaño',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'RETALLA',
    shortName: 'RT',
    description: 'Proceso de retalla para obtener submuestras',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'DETERMINACION DE PH',
    shortName: 'PH',
    description: 'Determinación del pH en soluciones',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'MEDICION DE XANTATOS',
    shortName: 'MX',
    description: 'Medición de concentración de xantatos en soluciones',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'MEDICION DE CIANURO',
    shortName: 'MC',
    description: 'Medición de concentración de cianuro en soluciones',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'DETERMINACION DE HUMEDAD',
    shortName: 'DH',
    description: 'Determinación del contenido de humedad en muestras sólidas',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
  {
    name: 'LEACHWELL',
    shortName: 'LW',
    description: 'Ensayo de lixiviación acelerada para oro y plata',
    analysisResult: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        unit: { type: 'string' },
      },
    },
  },
];
