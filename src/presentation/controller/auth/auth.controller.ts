import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Req,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthLoginUseCase } from '@domain/use-cases/auth/auth-login.user-case';
import { LoginDto } from './dto/login.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly authLoginUseCase: AuthLoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales del usuario para autenticación.',
  })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = await this.authLoginUseCase.execute(loginDto);
    return user;
  }
}
