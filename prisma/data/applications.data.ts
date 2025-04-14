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
    name: 'PLANTA',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/planta-Logo-Black.png',
    description:
      'PLANTA es una aplicación diseñada para optimizar la gestión y operación de plantas de beneficio. Proporciona herramientas para el monitoreo en tiempo real, la planificación de mantenimiento y la gestión de recursos, mejorando la eficiencia y reduciendo costos operativos.',
    path: 'planta',
  },
  {
    name: 'CI',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/ci-Logo-Black.png',
    description:
      'Comercializadora Internacional (CI) es una plataforma que facilita la gestión de operaciones comerciales internacionales. Permite a las empresas gestionar sus importaciones y exportaciones, optimizando procesos logísticos y aduaneros para mejorar la eficiencia y reducir costos.',
    path: 'ci',
  },
  {
    name: 'MINA',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/mina-Logo-Black.png',
    description:
      'MINA es un sistema de gestión diseñado para la industria minera. Proporciona herramientas para la planificación, monitoreo y control de operaciones mineras, mejorando la eficiencia y seguridad en el manejo de recursos naturales.',
    path: 'mina',
  },
  {
    name: 'BOREALIS APP',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/borealis-Logo-Black.png',
    description:
      'BOREALIS APP permite realizar las configuraciones de maestros de la aplicación AurumSuite. Facilita la gestión de datos maestros, configuraciones y personalizaciones de la plataforma Borealis, mejorando la eficiencia y adaptabilidad del sistema a las necesidades específicas de cada usuario.',
    path: '/borealis-app',
  },
  {
    name: 'GESTIÓN HUMANA',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/gh-Logo-Black.png',
    description:
      'GESTIÓN HUMANA es una aplicación que permite gestionar eficientemente los recursos humanos de una organización. Facilita la administración de nómina, seguimiento de asistencia, gestión de talento y desarrollo organizacional, mejorando la productividad y satisfacción del personal.',
    path: '/gestion-humana',
  },
];
