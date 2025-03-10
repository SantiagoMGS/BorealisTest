interface SeedAction {
  name: string;
  level: number;
}

export const actionInitialData: SeedAction[] =
 [
  { name: 'read', level: 1 },
  { name: 'create', level: 2},
  { name: 'update', level: 3},
  { name: 'delete', level: 4},
]; 
