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
    name: 'Borealis',
    logo: 'https://borealis.com/logo.png',
    applicationIds: ['d48a9610-0e4d-4e24-b8f9-e845e39e52b2'],
    primaryColor: '#FFFFFF',
    secondaryColor: '#000000',
    thirdColor: '#1487447',
  },
];
