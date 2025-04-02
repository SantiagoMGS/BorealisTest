export class Application {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly logo?: string | null,
    public readonly code?: string,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly createdBy?: string,
    public readonly updatedBy?: string,
    public readonly isDeleted: boolean = false,
  ) {}
}