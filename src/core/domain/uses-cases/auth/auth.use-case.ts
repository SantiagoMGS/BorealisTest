import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async validateUser(email: string, plainPassword: string): Promise<any> {
    try {
      const user = await this.loginRepository.findByEmailWithPassword(email);
  
      const isPasswordValid = await bcrypt.compare(plainPassword, user.hashedPassword);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
  
      const { hashedPassword: _, ...safeUser } = user;
  
      const companies = await this.loginRepository.getCompanyByUserId(user.id);
  
      return {
        ...safeUser,
        companies, // ya vienen en formato { id, name, branding }
      };
    } catch (error) {
      this.logger.error("🔴 Error: Error en validateUser()", error);
  
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
  
      throw new UnauthorizedException("Error interno al validar el usuario");
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
