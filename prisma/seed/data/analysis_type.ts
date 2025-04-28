import { Prisma } from '@prisma/client';

// Definir un tipo personalizado sin el campo resultSchema que ya no existe en el esquema
type AnalysisTypeData = {
  name: string;
  shortName: string;
  description?: string | null;
  isActive?: boolean;
};

export const analysisTypeInitialData: AnalysisTypeData[] = [
  {
    name: 'XRF',
    shortName: 'XRF',
    description:
      'Análisis por fluorescencia de rayos X para identificación rápida de elementos',
  },
  {
    name: 'ABSORCION ATOMIC',
    shortName: 'AA',
    description:
      'Análisis por absorción atómica para determinar elementos químicos',
  },
  {
    name: 'ENSAYO AL FUEGO',
    shortName: 'EF',
    description: 'Método clásico de ensayo al fuego para metales preciosos',
  },
  {
    name: 'GRANULOMETRICO',
    shortName: 'G',
    description:
      'Análisis granulométrico para determinar la distribución de tamaños de partícula',
  },
  {
    name: 'MALLAS VALORADAS',
    shortName: 'MV',
    description:
      'Análisis por mallas valoradas para determinar la distribución de valores por tamaño',
  },
  {
    name: 'RETALLA',
    shortName: 'RT',
    description: 'Proceso de retalla para obtener submuestras',
  },
  {
    name: 'DETERMINACION DE PH',
    shortName: 'PH',
    description: 'Determinación del pH en soluciones',
  },
  {
    name: 'MEDICION DE XANTATOS',
    shortName: 'MX',
    description: 'Medición de concentración de xantatos en soluciones',
  },
  {
    name: 'MEDICION DE CIANURO',
    shortName: 'MC',
    description: 'Medición de concentración de cianuro en soluciones',
  },
  {
    name: 'DETERMINACION DE HUMEDAD',
    shortName: 'DH',
    description: 'Determinación del contenido de humedad en muestras sólidas',
  },
  {
    name: 'LEACHWELL',
    shortName: 'LW',
    description: 'Ensayo de lixiviación acelerada para oro y plata',
  },
];
