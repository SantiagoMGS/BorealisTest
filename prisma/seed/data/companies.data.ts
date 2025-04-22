import { Prisma } from '@prisma/client';

export const companyInitialData: Prisma.CompanyCreateInput[] = [
  {
    name: 'QUINTANA',
    shortName: 'QU',
    branding: {
      // Para relaciones anidadas, usamos 'create' en lugar de asignar directamente
      create: {
        logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
        primaryColor: '#FFFFFF',
        secondaryColor: '#000000',
        tertiaryColor: '#148744',
      },
    },
  },
  {
    name: 'MONA MINAS',
    shortName: 'MM',
    branding: {
      create: {
        logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
        primaryColor: '#FFFFFF',
        secondaryColor: '#000000',
        tertiaryColor: '#148744',
      },
    },
  },
  {
    name: 'COLOMBIAN MINT',
    shortName: 'CM',
    branding: {
      create: {
        logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
        primaryColor: '#FFFFFF',
        secondaryColor: '#000000',
        tertiaryColor: '#148744',
      },
    },
  },
];
