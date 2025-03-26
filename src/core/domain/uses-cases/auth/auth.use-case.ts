import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ILoginRepository } from '../../repositories/login.repository';
import { RefreshTokenUseCase } from './refresh-token.use-case';

@Injectable()
export class AuthUseCase {
  private readonly logger = new Logger(AuthUseCase.name);
  constructor(
    @Inject('ILoginRepository') private readonly loginRepository: ILoginRepository, private refreshTokenUseCase: RefreshTokenUseCase,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    try {

      // Debes obtener la contraseña en la consulta    
      const user = await this.loginRepository.findByEmailWithPassword(email);
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Comparar la contraseña ingresada con la almacenada
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Retornar datos sin la contraseña
      const { password: _, ...result } = user;
      // Obtener las compañías asociadas al usuario
      const companies = await this.loginRepository.getCompanyByUserId(user.id);
      return { ...result, companies }
    } catch (error) {
      this.logger.error("🔴 Error: Error en validateUser()", error);
      throw new Error("Error interno al validar el usuario");
    }

  }
  async login(user: any) {
    if (!user || !user.email || !user.id) {
      this.logger.error("🔴 Error: Datos de usuario inválidos en login()", user);
      throw new Error("No se puede generar el token: Datos de usuario inválidos");
    }

    const payload = { email: user.email, sub: user.id };
    try {
      const token = this.jwtService.sign(payload);
      const tokens = await this.refreshTokenUseCase.generateTokens(user);

      return {
        tokens: {
          access_token: token,
          refresh_token: tokens.refreshToken,
          refresh_token_expires_at: tokens.refreshTokenExpiresAt,
        },
      };
    } catch (error) {
      this.logger.log("🔴 Error generando el token JWT:", error);
      throw new Error("Error interno al generar el token");
    }
  }

}
