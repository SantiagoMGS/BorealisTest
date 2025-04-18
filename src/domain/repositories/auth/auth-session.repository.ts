import { ISessionEntity } from "@domain/entities/auth/auth-session.entity";

export abstract class AuthSessionRepository {
  abstract createSession(sessionData: ISessionEntity): Promise<ISessionEntity>;
  abstract getActiveSessionByUserId(userId: string): Promise<ISessionEntity | null>;
  abstract invalidateUserSessions(userId: string): Promise<void>;
  abstract validateSession(token: string): Promise<boolean>;
  abstract updateLastActive(token: string): Promise<void>;
  abstract invalidateSession(token: string): Promise<void>;
}