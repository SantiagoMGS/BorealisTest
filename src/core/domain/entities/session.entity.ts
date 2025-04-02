export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date | string,
    public readonly refreshToken?: string | null,
    public readonly device?: string | null,
    public readonly ipAddress?: string | null,
    public readonly refreshExpiresAt?: Date | null,
    public readonly createdAt?: Date | string,
    public readonly lastActive?: Date | string,
  ) { }
} 