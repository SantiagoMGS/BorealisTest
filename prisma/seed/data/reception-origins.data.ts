import { Prisma } from '@prisma/client';

export const receptionOriginInitialData: Prisma.ReceptionOriginCreateInput[] = [
  {
    name: 'Minería de Subsistencia',
    shortName: 'MS',
    description:
      'Material extraído por mineros artesanales o pequeña minería con volúmenes limitados',
  },
  {
    name: 'Joyería Desuso',
    shortName: 'JD',
    description:
      'Piezas de joyería obsoletas o dañadas destinadas a reciclaje y recuperación de metales',
  },
  {
    name: 'Joyería de Plata',
    shortName: 'JP',
    description:
      'Artículos de plata para evaluación o recuperación del metal precioso',
  },
  {
    name: 'Veta Fundido',
    shortName: 'VF',
    description:
      'Material extraído directamente de vetas mineralógicas procesado por fundición',
    hasMiningTitle: true,
  },
  {
    name: 'Plata Fundida',
    shortName: 'PF',
    description:
      'Material fundido de plata para evaluación o recuperación del metal precioso',
    hasMiningTitle: true,
  },
  {
    name: 'COLA',
    shortName: 'CO',
    description:
      'Residuos finales del proceso de beneficio mineral con contenido metálico residual',
  },
  {
    name: 'CABEZA MOLINO',
    shortName: 'CM',
    description:
      'Material inicial que ingresa al proceso de molienda para su tratamiento',
  },
  {
    name: 'OVERFLOW',
    shortName: 'OV',
    description:
      'Material excedente de los procesos de clasificación en circuitos de molienda',
  },
  {
    name: 'CONCENTRADO FLOTACION',
    shortName: 'CF',
    description:
      'Producto enriquecido obtenido mediante el proceso de flotación selectiva de minerales',
  },
  {
    name: 'MUESTRA DE MINA',
    shortName: 'MM (VARIAS)',
    description:
      'Especímenes recolectados directamente de la explotación minera para análisis y control',
  },
  {
    name: 'BIG BAGS',
    shortName: 'BB',
    description:
      'Material mineral transportado en contenedores flexibles de gran capacidad para procesamiento',
  },
  {
    name: 'SOLUCION LIQUIDA',
    shortName: 'SL',
    description:
      'Fase líquida que contiene metales disueltos para su posterior recuperación',
  },
  {
    name: 'SOLUCION BARREN',
    shortName: 'SB',
    description:
      'Solución empobrecida después de la extracción de metales preciosos en procesos hidrometalúrgicos',
  },
  {
    name: 'MUESTRA DE PATIO O PILA',
    shortName: '',
    description:
      'Material almacenado en patios de acopio o pilas de lixiviación para control de calidad',
  },
  {
    name: 'MUESTRA AMBIENTAL',
    shortName: 'MA',
    description:
      'Especímenes recolectados para monitoreo y cumplimiento de normativas ambientales',
  },
];
