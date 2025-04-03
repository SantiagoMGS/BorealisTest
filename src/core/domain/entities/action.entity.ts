
export class Action {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly level: number,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly createdBy?: string,
    public readonly updatedBy?: string,
  ) { }
}