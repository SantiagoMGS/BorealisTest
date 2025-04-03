import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { AssignApplicationToCompaniesUseCase } from 'src/core/domain/uses-cases/company/assign-application-to-companies.use-case';
import { CreateCompanyUseCase } from 'src/core/domain/uses-cases/company/create-company.use-case';
import { DeleteCompanyUseCase } from 'src/core/domain/uses-cases/company/delete-company.use-case';
import { GetAllCompaniesUseCase } from 'src/core/domain/uses-cases/company/get-all-company.use-case';
import { GetByIdCompanyUseCase } from 'src/core/domain/uses-cases/company/get-by-id-company.use-case';
import { GetByNameCompanyUseCase } from 'src/core/domain/uses-cases/company/get-by-name-company.use-case';
import { UpdateCompanyUseCase } from 'src/core/domain/uses-cases/company/update-company.use-case';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@ApiTags('Compañías')
@Controller('company')
@UseGuards(AuthGuard('internal'), PermissionGuard)
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly getByIdCompanyUseCase: GetByIdCompanyUseCase,
    private readonly getAllCompaniesUseCase: GetAllCompaniesUseCase,
    private readonly getByNameCompanyUseCase: GetByNameCompanyUseCase,
    private readonly assignApplicationToCompaniesUseCase: AssignApplicationToCompaniesUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva compañía' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La compañía ha sido creada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyUseCase.execute(createCompanyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las compañías con paginación' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página, el valor predeterminado es 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Número de elementos por página, el valor predeterminado es 10',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de compañías.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async getAllCompanies(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.getAllCompaniesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una compañía por ID' })
  @ApiParam({ name: 'id', required: true, description: 'UUID de la compañía' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalles de la compañía.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Compañía no encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async getCompanyById(@Param('id', ParseUUIDPipe) id: string) {
    const company = await this.getByIdCompanyUseCase.execute(id);
    if (!company)
      throw new NotFoundException(`Compañía con ID ${id} no encontrada`);
    return company;
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una compañía por nombre' })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalles de la compañía.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Compañía no encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async getCompanyByName(@Param('name') name: string) {
    const company = await this.getByNameCompanyUseCase.execute(name);
    if (!company)
      throw new NotFoundException(`Compañía con nombre ${name} no encontrada`);
    return company;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una compañía' })
  @ApiParam({ name: 'id', required: true, description: 'UUID de la compañía' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La compañía ha sido actualizada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Compañía no encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const updatedCompany = await this.updateCompanyUseCase.execute(
      id,
      updateCompanyDto,
    );
    return {
      message: `Compañía con ID ${id} actualizada correctamente.`,
      company: updatedCompany,
    };
  }


  @Post('assign-applications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Asignar aplicaciones a compañías' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          description: 'Array de UUIDs de compañías',
        },
        applicationIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          description: 'Array de UUIDs de aplicaciones',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aplicaciones asignadas exitosamente a las compañías.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async assignApplicationsToCompanies(
    @Body() assignDto: { companyIds: string[]; applicationIds: string[] },
  ) {
    return this.assignApplicationToCompaniesUseCase.execute(
      assignDto.companyIds,
      assignDto.applicationIds,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una compañía' })
  @ApiParam({ name: 'id', required: true, description: 'UUID de la compañía' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La compañía ha sido eliminada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Compañía no encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async deleteCompany(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteCompanyUseCase.execute(id);
    return { message: `Compañía con ID ${id} eliminada correctamente.` };
  }
}
