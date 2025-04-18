import { PrismaService } from '@core/prisma/prisma.service';
import { ISessionEntity } from '@domain/entities/auth/auth-session.entity';
import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';

@Injectable()
export class AuthSessionDataSourceService {
    constructor(private prisma: PrismaService) { }

    private mapToEntity(session: Session): ISessionEntity {
        return {
            id: session.id,
            userId: session.userId,
            token: session.token,
            refreshToken: session.refreshToken || undefined,
            expiresAt: session.expiresAt,
            refreshExpiresAt: session.refreshExpiresAt || undefined,
            device: session.device || undefined,
            ipAddress: session.ipAddress || undefined,
            lastActive: session.lastActive,
        };
    }

    async createSession(sessionData: ISessionEntity): Promise<ISessionEntity> {
        const session = await this.prisma.session.create({
            data: {
                id: sessionData.id,
                userId: sessionData.userId,
                token: sessionData.token,
                refreshToken: sessionData.refreshToken,
                expiresAt: sessionData.expiresAt,
                refreshExpiresAt: sessionData.refreshExpiresAt,
                device: sessionData.device,
                ipAddress: sessionData.ipAddress,
                lastActive: sessionData.lastActive || new Date(),
            }
        });

        return this.mapToEntity(session);
    }

    async getActiveSessionByUserId(userId: string): Promise<ISessionEntity | null> {
        const now = new Date();

        const session = await this.prisma.session.findFirst({
            where: {
                userId,
                expiresAt: {
                    gt: now,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!session) return null;

        return this.mapToEntity(session);
    }

    async invalidateUserSessions(userId: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                userId,
                expiresAt: {
                    gt: new Date(),
                },
            },
            data: {
                expiresAt: new Date(),
                refreshExpiresAt: new Date(),
            },
        });
    }

    async validateSession(token: string): Promise<boolean> {
        const now = new Date();

        const session = await this.prisma.session.findFirst({
            where: {
                token,
                expiresAt: {
                    gt: now,
                },
            },
        });

        return !!session;
    }

    async updateLastActive(token: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                token,
            },
            data: {
                lastActive: new Date(),
            },
        });
    }

    async invalidateSession(token: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                token,
            },
            data: {
                expiresAt: new Date(),
                refreshExpiresAt: new Date(),
            },
        });
    }
}