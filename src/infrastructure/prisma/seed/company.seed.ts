interface SeedCompany {
  name: string;
  logo: string;
  applicationIds: string[];
  primaryColor: string;
  secondaryColor: string;
  thirdColor: string;
}

export const companyInitialData: SeedCompany[] = [
  {
    name: 'BOREALIS',
    logo: 'https://borealis.com/logo.png',
    applicationIds: [],
    primaryColor: '#FFFFFF',
    secondaryColor: '#000000',
    thirdColor: '#1487447',
  },
];
