import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SessionManagementUseCase } from './session-management.use-case';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly sessionManagementUseCase: SessionManagementUseCase,
  ) {}

  async execute(req: Request): Promise<boolean> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    // El formato es "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    // Invalidar la sesión usando el servicio de gestión de sesiones
    await this.sessionManagementUseCase.invalidateSession(token);

    return true;
  }
}
