import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Req,
  UseInterceptors,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUseCase } from '@domain/use-cases/auth/login.use-case';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, ErrorResponseDto } from './dto/login-response.dto';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { ILoginResponse } from '@domain/interfaces/auth/login-response.interface';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '@core/decorators/current-user.decorator';

@ApiTags('Autenticación')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales del usuario para autenticación.',
  })
  @ApiOkResponse({
    description: 'Usuario autenticado correctamente',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas',
    type: ErrorResponseDto,
  })
  @CustomResponse({
    successMessage: 'Usuario autenticado correctamente',
  })
  async login(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    return await this.loginUseCase.execute(loginDto);
  }
}
