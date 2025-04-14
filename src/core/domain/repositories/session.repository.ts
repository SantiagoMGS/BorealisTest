import { SessionWithUser } from 'src/infrastructure/prisma/prisma-session.repository';
import { Session } from '../entities/session.entity';

export interface ISessionRepository {
  createSession(session: Omit<Session, 'id'>): Promise<Session>;
  countActiveSessions(userId: string): Promise<number>;
  findActiveSessions(userId: string): Promise<Session[]>;
  deleteSession(token: string): Promise<void>;
  findSessionByRefreshToken(refreshToken: string): Promise<SessionWithUser | null>;
  findSessionByToken(token: string): Promise<Session | null>;
  updateSession(id: string, data: Partial<Session>): Promise<Session>;
  deleteExpiredSessions(): Promise<number>;
  deleteAllUserSessions(userId: string): Promise<number>;
  updateSessionActivity(id: string): Promise<void>;
}
