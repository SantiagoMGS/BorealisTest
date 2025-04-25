import { Prisma } from '@prisma/client';

// Definir un tipo personalizado sin el campo resultSchema que ya no existe en el esquema
type AnalysisTypeData = {
  name: string;
  shortName: string;
  description?: string | null;
  isActive?: boolean;
  requiredAmount: string;
};

export const analysisTypeInitialData: AnalysisTypeData[] = [
  {
    name: 'XRF',
    shortName: 'XRF',
    requiredAmount: '30GR',
    description:
      'Análisis por fluorescencia de rayos X para identificación rápida de elementos',
    isActive: true,
  },
  {
    name: 'ABSORCION ATOMIC',
    shortName: 'AA',
    requiredAmount: '100 ML Max',
    description:
      'Análisis por absorción atómica para determinar elementos químicos',
    isActive: true,
  },
  {
    name: 'ENSAYO AL FUEGO',
    shortName: 'EF',
    requiredAmount: '30GR',
    description: 'Método clásico de ensayo al fuego para metales preciosos',
    isActive: true,
  },
  {
    name: 'GRANULOMETRICO',
    shortName: 'G',
    requiredAmount: '500 GR O 1000 GR',
    description:
      'Análisis granulométrico para determinar la distribución de tamaños de partícula',
    isActive: true,
  },
  {
    name: 'MALLAS VALORADAS',
    shortName: 'MV',
    requiredAmount: '500 GR O 1000 GR',
    description:
      'Análisis por mallas valoradas para determinar la distribución de valores por tamaño',
    isActive: true,
  },
  {
    name: 'RETALLA',
    shortName: 'RT',
    requiredAmount: '',
    description: 'Proceso de retalla para obtener submuestras',
    isActive: true,
  },
  {
    name: 'DETERMINACION DE PH',
    shortName: 'PH',
    requiredAmount: '500 ML',
    description: 'Determinación del pH en soluciones',
    isActive: true,
  },
  {
    name: 'MEDICION DE XANTATOS',
    shortName: 'MX',
    requiredAmount: '100 ML Max',
    description: 'Medición de concentración de xantatos en soluciones',
    isActive: true,
  },
  {
    name: 'MEDICION DE CIANURO',
    shortName: 'MC',
    requiredAmount: '500 ML',
    description: 'Medición de concentración de cianuro en soluciones',
    isActive: true,
  },
  {
    name: 'DETERMINACION DE HUMEDAD',
    shortName: 'DH',
    requiredAmount: '3500 GR',
    description: 'Determinación del contenido de humedad en muestras sólidas',
    isActive: true,
  },
  {
    name: 'LEACHWELL',
    shortName: 'LW',
    requiredAmount: '200 GR',
    description: 'Ensayo de lixiviación acelerada para oro y plata',
    isActive: true,
  },
];
