import { Inject, Injectable, Logger } from "@nestjs/common";
import { ISessionRepository } from "../../repositories/session.repository";
import { ConfigService } from "@nestjs/config";
import { Session } from "../../entities/session.entity";

@Injectable()
export class ManageSessionUseCase {
  private readonly logger = new Logger(ManageSessionUseCase.name);

  private MAX_ACTIVE_SESSIONS: number;

  constructor(
    @Inject('ISessionRepository')
    private sessionRepository: ISessionRepository,
    private configService: ConfigService
  ) {
    this.MAX_ACTIVE_SESSIONS = this.configService.get<number>('MAX_ACTIVE_SESSIONS', 1);
  }

  async createSession(userId: string, token: string, deviceInfo?: string): Promise<Session> {
    const activeSessions = await this.sessionRepository.findActiveSessions(userId);

    const sameDevice = activeSessions.find(
      session => session.device === deviceInfo
    );

    const differentDeviceSession = activeSessions.find(
      session => session.device !== deviceInfo
    );

    // ✅ Si hay otra sesión en distinto dispositivo
    if (differentDeviceSession) {
      this.logger.warn(`⚠️ Usuario ${userId} ya tiene sesión activa en otro dispositivo.`);

      throw new Error("Ya hay una sesión activa en otro dispositivo.");
    }

    // El resto de la lógica sigue...
    if (activeSessions.length >= this.MAX_ACTIVE_SESSIONS) {
      await this.sessionRepository.deleteSession(activeSessions[0].token);
    }

    const newSession: Omit<Session, 'id'> = {
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