import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Req,
  Logger,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthLoginUseCase } from '@domain/use-cases/auth/auth-login.user-case';
import { LoginDto } from './dto/login.dto';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';

@ApiTags('Autenticación')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
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
  @CustomResponse({
    successMessage: 'Usuario autenticado correctamente',
  })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return await this.authLoginUseCase.execute(loginDto);
  }
}
