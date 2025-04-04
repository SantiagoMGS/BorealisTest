import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class JwtInternalStrategy extends PassportStrategy(Strategy, 'internal') {
  constructor(private configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // Validar el payload
    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedException('Token inválido o incompleto');
    }

    // Buscar al usuario en la base de datos
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        companies: {
          select: {
            role: {
              select: {
                permissions: {
                  select: {
                    subresource: { select: { name: true } },
                    action: { select: { name: true, level: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Verificar si el usuario existe
    if (!user) {
      console.error(`Usuario no encontrado para el ID: ${payload.sub}`);
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Extraer permisos
    const permissions = user.companies.flatMap((uc) =>
      uc.role.permissions.map((p) => ({
        resource: p.subresource.name,
        action: p.action.name,
        level: p.action.level,
      }))
    );

    // Devolver el usuario validado
    return {
      id: user.id,
      email: user.email,
      permissions,
    };
  }
}
