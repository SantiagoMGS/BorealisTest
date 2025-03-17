interface SeedAction {
  name: string;
  level: number;
}

export const actionInitialData: SeedAction[] = [
  { name: 'READ', level: 1 },
  { name: 'CREATE', level: 2 },
  { name: 'UPDATE', level: 3 },
  { name: 'DELETE', level: 4 },
];
