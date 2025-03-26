import { Session } from "../entities/session.entity";

export interface ISessionRepository {
  createSession(session: Session): Promise<Session>;
  countActiveSessions(userId: string): Promise<number>;
  findActiveSessions(userId: string): Promise<Session[]>;
  deleteSession(token: string): Promise<void>;
}