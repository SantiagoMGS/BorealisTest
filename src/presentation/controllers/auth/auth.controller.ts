import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginUseCase, LogoutUseCase } from '@domain/use-cases/auth';
import { LoginDto } from './dtos';
import { LoginResponseDto, ErrorResponseDto } from './dtos';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { Request } from 'express';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { LoginMapper } from './mappers/login.mapper';

@ApiTags('Autenticación')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

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
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    // Convertir DTO a entidad de dominio
    const loginEntity = LoginMapper.toEntity(loginDto);

    // Ejecutar caso de uso
    const result = await this.loginUseCase.execute(loginEntity, req);

    // Convertir resultado a DTO de respuesta
    return LoginMapper.toResponseDto(result);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Sesión cerrada correctamente',
  })
  @CustomResponse({
    successMessage: 'Sesión cerrada correctamente',
  })
  async logout(@Req() req: Request): Promise<{ success: boolean }> {
    const success = await this.logoutUseCase.execute(req);
    return { success };
  }
}
