export type Session = {
  id?: string,
  userId: string,
  token: string,
  expiresAt: Date | string,
  refreshToken?: string | null,
  device?: string | null,
  ipAddress?: string | null,
  refreshExpiresAt?: Date | null,
  createdAt?: Date | string,
  lastActive?: Date | string,
} 