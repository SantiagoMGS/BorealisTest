import { ISessionEntity } from '@domain/entities/auth/auth-session.entity';
import { SessionRepository } from '@domain/repositories/auth/session.repository';
import { AuthSessionDataSourceService } from '@infrastructure/datasource/auth/session.datasource.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionRepositoryImpl implements SessionRepository {
  constructor(
    private readonly sessionDataSourceService: AuthSessionDataSourceService,
  ) {}

  async createSession(sessionData: ISessionEntity): Promise<ISessionEntity> {
    return this.sessionDataSourceService.createSession(sessionData);
  }

  async getActiveSessionByUserId(
    userId: string,
  ): Promise<ISessionEntity | null> {
    return this.sessionDataSourceService.getActiveSessionByUserId(userId);
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    return this.sessionDataSourceService.invalidateUserSessions(userId);
  }

  async validateSession(token: string): Promise<boolean> {
    return this.sessionDataSourceService.validateSession(token);
  }

  async updateLastActive(token: string): Promise<void> {
    return this.sessionDataSourceService.updateLastActive(token);
  }

  async invalidateSession(token: string): Promise<void> {
    return this.sessionDataSourceService.invalidateSession(token);
  }
}
