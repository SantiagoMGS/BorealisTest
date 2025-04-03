
export class Resource {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly icon: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly createdBy?: string,
    public readonly updatedBy?: string,
  ) { }
}