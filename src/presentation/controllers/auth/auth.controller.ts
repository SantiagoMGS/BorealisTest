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
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  LoginUseCase,
  LogoutUseCase,
  SetCompanyUseCase,
} from '@domain/use-cases/auth';
import { LoginDto, SetCompanyDto, LogoutResponseDto } from './dtos';
import { LoginResponseDto, SetCompanyResponseDto } from './dtos';
import { ErrorResponseDto } from '@shared/models/error-response.dto';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { Request } from 'express';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { LoginMapper } from './mappers/login.mapper';
import {
  ApiResponseDto,
  getResponseSchema,
} from '@shared/dtos/api-response.dto';

@ApiTags('Autenticación')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
@ApiExtraModels(
  ApiResponseDto,
  LoginResponseDto,
  SetCompanyResponseDto,
  LogoutResponseDto,
  ErrorResponseDto,
)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly setCompanyUseCase: SetCompanyUseCase,
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
    ...getResponseSchema(LoginResponseDto),
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
    ...getResponseSchema(LogoutResponseDto),
  })
  @CustomResponse({
    successMessage: 'Sesión cerrada correctamente',
  })
  async logout(@Req() req: Request): Promise<LogoutResponseDto> {
    const success = await this.logoutUseCase.execute(req);
    return { success };
  }

  @Post('set-company')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Establecer compañía activa para el usuario' })
  @ApiBearerAuth()
  @ApiBody({
    type: SetCompanyDto,
    description: 'Datos para establecer la compañía del usuario',
  })
  @ApiOkResponse({
    description: 'Compañía establecida correctamente',
    ...getResponseSchema(SetCompanyResponseDto),
  })
  @CustomResponse({
    successMessage: 'Compañía establecida correctamente',
  })
  async setCompany(
    @Body() setCompanyDto: SetCompanyDto,
    @Req() req: Request,
  ): Promise<SetCompanyResponseDto> {
    return this.setCompanyUseCase.execute(setCompanyDto.companyId, req);
  }
}
