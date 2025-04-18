import {
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { GetPermissionsByCompanyUseCase } from '@domain/use-cases/user/get-permissions-by-company.use-case';
import { PermissionsByCompanyResponseDto } from './dtos/permissions-response.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from '@core/decorators/custom-response.decorator';

@ApiTags('Usuarios')
@Controller('user')
export class UserController {
  constructor(
    private readonly getPermissionsByCompanyUseCase: GetPermissionsByCompanyUseCase,
  ) {}

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
  @ApiResponse({ status: 403, description: 'No tiene acceso a esta compañía' })
  @ApiResponse({ status: 404, description: 'Compañía no encontrada' })
  @CustomResponse({
    successMessage: 'Permisos obtenidos correctamente',
  })
  async getPermissionsByCompany(
    @CurrentUser() user: any,
    @Param('companyId') companyId: string,
  ): Promise<PermissionsByCompanyResponseDto> {
    try {
      const permissions = await this.getPermissionsByCompanyUseCase.execute(
        user.id,
        companyId,
      );
      return permissions as PermissionsByCompanyResponseDto;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'La compañía no existe') {
          throw new NotFoundException('La compañía no existe');
        }
        if (error.message === 'El usuario no pertenece a esta compañía') {
          throw new ForbiddenException('No tienes acceso a esta compañía');
        }
      }
      throw error;
    }
  }
}
