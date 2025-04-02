interface SeedCompany {
  name: string;
  logo: string;
  applicationIds: string[];
  branding?: SeedBranding

}
export interface SeedBranding {
  logo: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string

}

export const companyInitialData: SeedCompany[] = [
  {
    name: 'BOREALIS',
    logo: 'https://borealis.com/logo.png',
    applicationIds: [],
    branding: {
      logo: 'https://borealis.com/logo.png',
      primaryColor: '#FFFFFF',
      secondaryColor: '#000000',
      tertiaryColor: '#1487447',
    },

  },
];
