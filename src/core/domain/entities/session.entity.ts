export class Session {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly userId: string,
    public readonly token: string,
    public readonly device: string | null,
    public readonly lastActive: Date,
  ) { }
}