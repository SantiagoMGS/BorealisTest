interface SeedApplication {
  name: string;
  logo?: string;
  path: string
}

export const applicationInitialData: SeedApplication[] = [
  {
    name: 'LIMS',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
    path: 'lims',
  },
  {
    name: 'PLANTA',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
    path: 'planta',
  },
  {
    name: 'CI',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
    path: 'ci',
  },
  {
    name: 'MINA',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
    path: 'mina',
  },
  {
    name: 'BOREALIS APP',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/Borealis-Logo-Black.png',
    path: 'borealis-app',
  },
  {
    name: 'GESTIÓN HUMANA',
    logo: 'https://www.borealis.com/wp-content/uploads/2023/01/GH-Logo-Black.png',
    path: 'gestion-humana',
  },
];
