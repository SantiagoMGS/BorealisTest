import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { Session } from "src/core/domain/entities/session.entity";
import { ISessionRepository } from "src/core/domain/repositories/session.repository";

@Injectable()
export class PrismaSessionRepository  implements ISessionRepository{
  constructor(private readonly prisma: PrismaService) { }

  async createSession(data: Omit<Session, 'id'>): Promise<Session> {
     
    return this.prisma.session.create({ data });
  }

  async findActiveSessions(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { lastActive: 'desc' }
    });
  }

  async countActiveSessions(userId: string): Promise<number> {
    return this.prisma.session.count({ where: { userId } });
  }

  async deleteSession(token: string): Promise<void> {
    await this.prisma.session.delete({ where: { token } });
  }

  async updateSessionActivity(token: string): Promise<void> {
    await this.prisma.session.update({
      where: { token },
      data: { lastActive: new Date() }
    });
  }
} 