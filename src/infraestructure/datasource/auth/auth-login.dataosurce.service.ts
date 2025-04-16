import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { LoginDto } from '@presentation/controller/auth/dtos/login.dto';
import { AUTH_MESSAGE } from '@shared/constants/auth-message';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthLoginDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new Error(AUTH_MESSAGE.CREDENTIALS_INCORRECT);
    }

    // Comparar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new Error(AUTH_MESSAGE.CREDENTIALS_INCORRECT);
    }

    // Omitir la contraseña en la respuesta
    const { hashedPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
