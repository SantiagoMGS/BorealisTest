import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
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
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        companies: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    subresource: true,
                    action: true, // ✅ OBTENER EL `level` DESDE `Action`
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    // Extraer permisos con `level`
    const permissions = user.companies.flatMap(uc =>
      uc.role.permissions.map(p => ({
        resource: p.subresource.name,
        action: p.action.name,
        level: p.action.level,  // ✅ Incluir `level`
      }))
    );

    return { userId: user.id, email: user.email, permissions };
  }

}
