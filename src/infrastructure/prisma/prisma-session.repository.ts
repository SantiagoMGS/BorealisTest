import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { Session } from "src/core/domain/entities/session.entity";
import { ISessionRepository } from "src/core/domain/repositories/session.repository";
import { User } from "src/core/domain/entities";

export type SessionWithUser = Session & { user: Omit<User, 'password'> };

@Injectable()
export class PrismaSessionRepository implements ISessionRepository {
  private readonly logger = new Logger(PrismaSessionRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createSession(data: Omit<Session, 'id'>): Promise<Session> {
    try {
      return await this.prisma.session.create({ data });
    } catch (error) {
      this.logger.error('Error creating session', error);
      throw new Error('Error creating session');
    }
  }

  async findActiveSessions(userId: string): Promise<Session[]> {
    try {
      return await this.prisma.session.findMany({
        where: { userId },
        orderBy: { lastActive: 'desc' },
      });
    } catch (error) {
      this.logger.error('Error finding active sessions', error);
      throw new Error('Error finding active sessions');
    }
  }

  async countActiveSessions(userId: string): Promise<number> {
    try {
      return await this.prisma.session.count({ where: { userId } });
    } catch (error) {
      this.logger.error('Error counting active sessions', error);
      throw new Error('Error counting active sessions');
    }
  }

  async deleteSession(token: string): Promise<void> {
    try {
      await this.prisma.session.delete({ where: { token } });
    } catch (error) {
      this.logger.warn(`Session with token ${token} not found`, error);
      throw new Error('Session not found');
    }
  }

  async updateSessionActivity(token: string): Promise<void> {
    try {
      await this.prisma.session.update({
        where: { token },
        data: { lastActive: new Date() },
      });
    } catch (error) {
      this.logger.error('Error updating session activity', error);
      throw new Error('Error updating session activity');
    }
  }

  async findSessionByRefreshToken(refreshToken: string): Promise<SessionWithUser | null> {
    try {
      return await this.prisma.session.findFirst({
        where: { refreshToken },
        include: { user: true },
      });
    } catch (error) {
      this.logger.error('Error finding session by refresh token', error);
      throw new Error('Error finding session by refresh token');
    }
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    try {
      return await this.prisma.session.findFirst({
        where: { token },
        include: { user: true },
      });
    } catch (error) {
      this.logger.error('Error finding session by token', error);
      throw new Error('Error finding session by token');
    }
  }

  async updateSession(id: string, data: Partial<Session>): Promise<Session> {
    try {
      return await this.prisma.session.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error('Error updating session', error);
      throw new Error('Error updating session');
    }
  }

  async deleteExpiredSessions(): Promise<number> {
    try {
      const now = new Date();
      const result = await this.prisma.session.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: now } },
            { refreshExpiresAt: { lt: now } },
          ],
        },
      });
      return result.count;
    } catch (error) {
      this.logger.error('Error deleting expired sessions', error);
      throw new Error('Error deleting expired sessions');
    }
  }

  async deleteAllUserSessions(userId: string): Promise<number> {
    try {
      const result = await this.prisma.session.deleteMany({
        where: { userId },
      });
      return result.count;
    } catch (error) {
      this.logger.error('Error deleting all user sessions', error);
      throw new Error('Error deleting all user sessions');
    }
  }
}