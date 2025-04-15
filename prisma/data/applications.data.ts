import { Prisma } from '@prisma/client';

export const applicationInitialData: Prisma.ApplicationCreateInput[] = [
  {
    name: 'LIMS',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/lims-Logo-Black.png',
    description:
      'LIMS es un sistema de gestión de información de laboratorio que permite a los laboratorios gestionar muestras, datos y flujos de trabajo de manera eficiente. Facilita la recopilación, seguimiento y análisis de datos, mejorando la calidad y la productividad en el laboratorio.',
    path: 'lims',
  },
  {
    name: 'ADMINISTRACIÓN',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/planta-Logo-Black.png',
    description:
      'ADMINISTRACIÓN es una aplicación diseñada para optimizar la gestión y operación de plantas de beneficio. Proporciona herramientas para el monitoreo en tiempo real, la planificación de mantenimiento y la gestión de recursos, mejorando la eficiencia y reduciendo costos operativos.',
    path: 'planta',
  },
];
