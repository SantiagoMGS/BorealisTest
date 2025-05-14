import { Prisma } from '@prisma/client';

type AnalysisTypeData = {
  name: string;
  shortName: string;
  description?: string | null;
  isActive?: boolean;
  analysisResult?: object;
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
        readingNo: { type: 'string' },
        time: { type: 'string', format: 'date-time' },
        type: { type: 'string' },
        duration: { type: 'string' },
        units: { type: 'string' },
        sequence: { type: 'string' },
        res: { type: 'string' },
        eScale: { type: 'string' },
        shapeTime: { type: 'string' },
        sample: { type: 'string' },
        location: { type: 'string' },
        inspector: { type: 'string' },
        misc: { type: 'string' },
        note: { type: 'string' },
        flags: { type: 'string' },
        mo: { type: 'string' },
        moError: { type: 'string' },
        zr: { type: 'string' },
        zrError: { type: 'string' },
        sr: { type: 'string' },
        srError: { type: 'string' },
        u: { type: 'string' },
        uError: { type: 'string' },
        rb: { type: 'string' },
        rbError: { type: 'string' },
        th: { type: 'string' },
        thError: { type: 'string' },
        pb: { type: 'string' },
        pbError: { type: 'string' },
        au: { type: 'string' },
        auError: { type: 'string' },
        se: { type: 'string' },
        seError: { type: 'string' },
        as: { type: 'string' },
        asError: { type: 'string' },
        hg: { type: 'string' },
        hgError: { type: 'string' },
        zn: { type: 'string' },
        znError: { type: 'string' },
        w: { type: 'string' },
        wError: { type: 'string' },
        cu: { type: 'string' },
        cuError: { type: 'string' },
        ni: { type: 'string' },
        niError: { type: 'string' },
        co: { type: 'string' },
        coError: { type: 'string' },
        fe: { type: 'string' },
        feError: { type: 'string' },
        mn: { type: 'string' },
        mnError: { type: 'string' },
        sb: { type: 'string' },
        sbError: { type: 'string' },
        sn: { type: 'string' },
        snError: { type: 'string' },
        cd: { type: 'string' },
        cdError: { type: 'string' },
        pd: { type: 'string' },
        pdError: { type: 'string' },
        ag: { type: 'string' },
        agError: { type: 'string' },
        bal: { type: 'string' },
        balError: { type: 'string' },
        nb: { type: 'string' },
        nbError: { type: 'string' },
        bi: { type: 'string' },
        biError: { type: 'string' },
        re: { type: 'string' },
        reError: { type: 'string' },
        ta: { type: 'string' },
        taError: { type: 'string' },
        hf: { type: 'string' },
        hfError: { type: 'string' },
        cr: { type: 'string' },
        crError: { type: 'string' },
        v: { type: 'string' },
        vError: { type: 'string' },
        ti: { type: 'string' },
        tiError: { type: 'string' },
        sc: { type: 'string' },
        scError: { type: 'string' },
        ca: { type: 'string' },
        caError: { type: 'string' },
        k: { type: 'string' },
        kError: { type: 'string' },
        s: { type: 'string' },
        sError: { type: 'string' },
        ba: { type: 'string' },
        baError: { type: 'string' },
        te: { type: 'string' },
        teError: { type: 'string' },
        al: { type: 'string' },
        alError: { type: 'string' },
        p: { type: 'string' },
        pError: { type: 'string' },
        si: { type: 'string' },
        siError: { type: 'string' },
        cl: { type: 'string' },
        clError: { type: 'string' },
        mg: { type: 'string' },
        mgError: { type: 'string' },
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
        status: { type: 'string' },
        dataset: { type: 'string' },
        method: { type: 'string' },
        au: { type: 'string' },
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
        dryWeight: { type: 'number' },
        moisture: { type: 'number' },
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
        time: { type: 'number' },
      },
    },
  },
];
