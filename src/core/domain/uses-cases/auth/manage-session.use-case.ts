import { Inject, Injectable } from "@nestjs/common";
import { ISessionRepository } from "../../repositories/session.repository";
import { ConfigService } from "@nestjs/config";
import { Session } from "../../entities/session.entity";

@Injectable()
export class ManageSessionUseCase {
  private MAX_ACTIVE_SESSIONS: number;

  constructor(
    @Inject('ISessionRepository')
    private sessionRepository: ISessionRepository,
    private configService: ConfigService
  ) {
    this.MAX_ACTIVE_SESSIONS = this.configService.get<number>('MAX_ACTIVE_SESSIONS', 3);
  }

  async createSession(userId: string, token: string, deviceInfo?: string): Promise<Session> {
    // Check session limit
    const activeSessionsCount = await this.sessionRepository.countActiveSessions(userId);

    if (activeSessionsCount >= this.MAX_ACTIVE_SESSIONS) {
      // Get and remove the oldest session
      const activeSessions = await this.sessionRepository.findActiveSessions(userId);
      if (activeSessions.length > 0) {
        await this.sessionRepository.deleteSession(activeSessions[0].token);
      }
    }

    // Create a new Session instance
    const newSession: Session = {
      id: this.generateSessionId(), // Generate a unique ID for the session
      userId,
      token,
      device: deviceInfo ?? null,
      lastActive: new Date(),
      createdAt: new Date(),
    };

    return this.sessionRepository.createSession(newSession);
  }
  private generateSessionId(): string {
    // Generate a unique session ID (e.g., using a UUID library or custom logic)
    return Math.random().toString(36).substr(2, 9); // Example implementation
  }

  async invalidateSession(token: string): Promise<void> {
    return this.sessionRepository.deleteSession(token);
  }

  async getActiveSessions(userId: string): Promise<Session[]> {
    return this.sessionRepository.findActiveSessions(userId);
  }
}