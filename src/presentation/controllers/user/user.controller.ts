import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { GetPermissionsByCompanyUseCase } from '@domain/use-cases/user/get-permissions-by-company.use-case';
import { PermissionsByCompanyResponseDto } from './dtos/permissions-response.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { CreateUserUseCase } from '@domain/use-cases/user/create-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { IAuthUser } from '@domain/entities/auth';

@ApiTags('Usuarios')
@Controller('user')
export class UserController {
  constructor(
    private readonly getPermissionsByCompanyUseCase: GetPermissionsByCompanyUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  @CustomResponse({
    successMessage: 'Usuario creado correctamente',
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() admin: IAuthUser,
  ): Promise<UserResponseDto> {
    const createdUser = await this.createUserUseCase.execute(
      createUserDto,
      admin.id,
    );
    return createdUser as UserResponseDto;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @CustomResponse({
    successMessage: 'Perfil del usuario obtenido correctamente',
  })
  async obtainProfile(@CurrentUser() user: any) {
    return user;
  }

  @Get('permissions/:companyId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener permisos del usuario para una compañía específica',
  })
  @ApiParam({
    name: 'companyId',
    description: 'ID de la compañía',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Permisos del usuario para la compañía',
    type: PermissionsByCompanyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'ID de compañía inválido' })
  @ApiResponse({ status: 403, description: 'No tiene acceso a esta compañía' })
  @ApiResponse({ status: 404, description: 'Compañía no encontrada' })
  @CustomResponse({
    successMessage: 'Permisos obtenidos correctamente',
  })
  async getPermissionsByCompany(
    @CurrentUser() user: any,
    @Param(
      'companyId',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: 400,
      }),
    )
    companyId: string,
  ): Promise<PermissionsByCompanyResponseDto> {
    const permissions = await this.getPermissionsByCompanyUseCase.execute(
      user.id,
      companyId,
    );
    return permissions;
  }
}
