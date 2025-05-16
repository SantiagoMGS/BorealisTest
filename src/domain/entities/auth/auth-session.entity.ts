export interface ISessionEntity {
  id?: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  refreshExpiresAt?: Date;
  device?: string;
  ipAddress?: string;
  lastActive?: Date;
}
