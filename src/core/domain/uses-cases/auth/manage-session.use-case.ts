import { Inject, Injectable, Logger } from "@nestjs/common";
import { ISessionRepository } from "../../repositories/session.repository";
import { Session } from "../../entities/session.entity";

@Injectable()
export class ManageSessionUseCase {
  private readonly logger = new Logger(ManageSessionUseCase.name);


  constructor(
    @Inject('ISessionRepository')
    private sessionRepository: ISessionRepository,
  ) {

  }

  async createSession(userId: string, token: string, deviceInfo?: string): Promise<Session> {
    const activeSessions = await this.sessionRepository.findActiveSessions(userId);

    for (const session of activeSessions) {

      // Borra todas las sesiones activas existentes, sin importar el device
      await this.sessionRepository.deleteSession(session.token);
      this.logger.warn(`🔁 Reemplazando sesión activa: ${session.token}`);
    }

    const newSession: Omit<Session, 'id'> = {
      userId,
      token,
      device: deviceInfo,
      lastActive: new Date(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Example: expires in 24 hours
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