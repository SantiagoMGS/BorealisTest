import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { LoginUseCase, LogoutUseCase } from '@domain/use-cases/auth';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ErrorResponseDto, LoginDto, LoginResponseDto } from './dtos';
import { LoginMapper } from './mappers/login.mapper';

@ApiTags('Autenticación')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) { }

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
