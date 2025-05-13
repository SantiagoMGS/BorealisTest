export interface IActionEntity {
  id?: string;
  name: string;
  level: number;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ActionLevel {
  READ = 1,
  CREATE = 2,
  UPDATE = 3,
  DELETE = 4,
}
