import { Prisma } from '@prisma/client';

export const receptionOriginInitialData: Prisma.ReceptionOriginCreateInput[] = [
  {
    name: 'Minería de Subsistencia',
    description:
      'Material proveniente de mineros artesanales que extraen oro de depósitos aluviales',
    shortName: 'MS',
  },
  {
    name: 'Veta Fundido',
    description:
      'Material fundido proveniente de la extracción en vetas de pequeña minería',
    shortName: 'VF',
  },
  {
    name: 'Plata Fundida',
    description: 'Material de plata procesado y fundido listo para refinación',
    shortName: 'PF',
  },
  {
    name: 'Joyería Desuso',
    description:
      'Material procedente de joyería reciclada o en desuso para refundición',
    shortName: 'JD',
  },
  {
    name: 'Joyería de Plata',
    description:
      'Material de plata proveniente de joyería fundida para reprocesamiento',
    shortName: 'JP',
  },
  {
    name: 'COLA',
    description:
      'Residuos del proceso de beneficio mineral con contenido metálico recuperable',
    shortName: 'CO',
  },
  {
    name: 'CABEZA MOLINO',
    description:
      'Material inicial que ingresa al proceso de molienda para tratamiento',
    shortName: 'CM',
  },
  {
    name: 'OVERFLOW',
    description:
      'Material excedente del proceso de clasificación en hidrociclones o cribas',
    shortName: 'OV',
  },
  {
    name: 'CONCENTRADO FLOTACION',
    description:
      'Material concentrado obtenido mediante el proceso de flotación selectiva',
    shortName: 'CF',
  },
  {
    name: 'MUESTRA DE MINA',
    description:
      'Muestras representativas extraídas directamente de la explotación minera',
    shortName: 'MM',
  },
  {
    name: 'BIG BAGS',
    description:
      'Material almacenado en grandes sacos contenedores para procesamiento a granel',
    shortName: 'BB',
  },
  {
    name: 'SOLUCION LIQUIDA',
    description:
      'Solución con contenido metálico en fase líquida proveniente de procesos hidrometalúrgicos',
    shortName: 'SL',
  },
  {
    name: 'SOLUCION BARREN',
    description:
      'Solución residual después de la extracción de valores metálicos en procesos de lixiviación',
    shortName: 'SB',
  },
  {
    name: 'MUESTRA DE PATIO O PILA',
    description:
      'Muestras tomadas de material almacenado en patios o pilas de lixiviación',
    shortName: 'MP',
  },
  {
    name: 'MUESTRA AMBIENTAL',
    description:
      'Muestras recolectadas para análisis y monitoreo de impacto ambiental',
    shortName: 'MA',
  },
];
