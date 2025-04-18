import { ISessionEntity } from "@domain/entities/auth/auth-session.entity";
import { AuthSessionRepository } from "@domain/repositories/auth/auth-session.repository";

import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthSessionManagementUseCase {
    constructor(
        private readonly authSessionRepository: AuthSessionRepository,
        private readonly jwtService: JwtService,
    ) { }

    async createSession(
        userId: string,
        device?: string,
        ipAddress?: string,
    ): Promise<{ token: string; refreshToken: string }> {
        await this.authSessionRepository.invalidateUserSessions(userId);

        const payload = { sub: userId };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

        const sessionData: ISessionEntity = {
            userId,
            token,
            refreshToken,
            expiresAt,
            refreshExpiresAt,
            device,
            ipAddress,
            lastActive: new Date(),
        };

        await this.authSessionRepository.createSession(sessionData);

        return { token, refreshToken };
    }

    async validateSession(token: string): Promise<boolean> {
        try {
            const payload = this.jwtService.verify(token);

            const isValid = await this.authSessionRepository.validateSession(token);

            if (isValid) {
                await this.authSessionRepository.updateLastActive(token);
            }

            return isValid;
        } catch (error) {
            return false;
        }
    }

    async invalidateSession(token: string): Promise<void> {
        return this.authSessionRepository.invalidateSession(token);
    }

    async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string } | null> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const userId = payload.sub;

            const session = await this.authSessionRepository.getActiveSessionByUserId(userId);

            if (!session || session.refreshToken !== refreshToken) {
                return null;
            }

            return this.createSession(userId, session.device, session.ipAddress);
        } catch (error) {
            return null;
        }
    }

}