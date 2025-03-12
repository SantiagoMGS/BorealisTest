import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAzureStrategy extends PassportStrategy(Strategy, 'jwt') {
  private client: jwksClient.JwksClient

  constructor(private configService: ConfigService) {
    Logger.log('✅ JwtStrategy se está registrando en NestJS');


    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (req, rawJwtToken, done) => {
        try {
          const decoded = jwt.decode(rawJwtToken, { complete: true }) as any;
          const kid = decoded?.header?.kid;

          if (!kid) {
            return done(new UnauthorizedException('No se encontró KID en el token'));
          }

          const key = this.client.getSigningKey(kid, (err, key) => {
            if (err) {
              Logger.error('🔴 Error al obtener la clave de firma:', err);
              return done(err);
            }
            const signingKey = key!.getPublicKey();
            done(null, signingKey);

          });
        } catch (error) {
          Logger.error('🔴 Error al obtener la clave de firma:', error);
          done(error);
        }
      },
      audience: `api://055481bb-4d15-49b3-a539-b93c27ef7598`,
      issuer: `https://sts.windows.net/${configService.get<string>('AZURE_AD_TENANT_ID')}/`,
      algorithms: ['RS256'],
    });

    this.client = jwksClient({
      jwksUri: `https://login.microsoftonline.com/${configService.get<string>('AZURE_AD_TENANT_ID')}/discovery/v2.0/keys`,
    });
  }

  async validate(payload: any) {

    if (!payload) {
      Logger.error('🔴 No se recibió payload en el token');
      throw new UnauthorizedException('Token inválido');
    }
    Logger.log('✅ Usuario autenticado correctamente:', { userId: payload.sub, user: payload });
    return { userId: payload.sub, name: payload.given_name + payload.family_name, email: payload.unique_name };
  }
}
