import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class AuthUseCase {
  private readonly logger = new Logger(AuthUseCase.name);
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    // Debes obtener la contraseña en la consulta    
    const user = await this.userRepository.findByEmailWithPassword(email);

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
    const companies = await this.userRepository.getCompanyByUserId(user.id);
    return { ...result, companies }
  }

  async login(user: any) {
    if (!user || !user.email || !user.id) {
      this.logger.error("🔴 Error: Datos de usuario inválidos en login()", user);
      throw new Error("No se puede generar el token: Datos de usuario inválidos");
    }

    const payload = { email: user.email, sub: user.id };
    try {
      const token = this.jwtService.sign(payload);
      return { access_token: token};
    } catch (error) {
      this.logger.log("🔴 Error generando el token JWT:", error);
      throw new Error("Error interno al generar el token");
    }
  }

}
