interface SeedUser {
  name: string;
  email: string;
  password: string;
  companyName: string;
  role: string;
}

export const userInitialData: SeedUser = {
  name: 'Admin',
  email: 'admin@example.com',
  password: 'admin',
  companyName: 'BOREALIS',
  role: 'ADMIN',
};
