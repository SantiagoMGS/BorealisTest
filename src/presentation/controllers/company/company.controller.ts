import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  AssignApplicationToCompaniesUseCase,
  CreateCompanyUseCase,
  DeleteCompanyUseCase,
  GetAllCompaniesUseCase,
  GetByIdCompanyUseCase,
  GetByNameCompanyUseCase,
  UpdateCompanyUseCase,
} from 'src/core/domain/uses-cases';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
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
  @ApiStandardResponses({ created: true, badRequest: true })
  async createCompany(@Body() dto: CreateCompanyDto) {
    return this.createCompanyUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las compañías con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiStandardResponses({ ok: 'Lista de compañías.' })
  async getAllCompanies(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.getAllCompaniesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una compañía por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la compañía' })
  @ApiStandardResponses({ ok: 'Detalles de la compañía.', notFound: 'Compañía no encontrada.' })
  async getCompanyById(@Param('id', ParseUUIDPipe) id: string) {
    const company = await this.getByIdCompanyUseCase.execute(id);
    if (!company) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);
    return company;
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una compañía por nombre' })
  @ApiParam({ name: 'name', description: 'Nombre de la compañía' })
  @ApiStandardResponses({ ok: 'Detalles de la compañía.', notFound: 'Compañía no encontrada.' })
  async getCompanyByName(@Param('name') name: string) {
    const company = await this.getByNameCompanyUseCase.execute(name);
    if (!company) throw new NotFoundException(`Compañía con nombre ${name} no encontrada`);
    return company;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una compañía' })
  @ApiParam({ name: 'id', description: 'UUID de la compañía' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiStandardResponses({ ok: 'La compañía ha sido actualizada exitosamente.', badRequest: true, notFound: 'Compañía no encontrada.' })
  async updateCompany(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCompanyDto) {
    const updated = await this.updateCompanyUseCase.execute(id, dto);
    return {
      message: `Compañía con ID ${id} actualizada correctamente.`,
      company: updated,
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
        },
        applicationIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
      },
    },
  })
  @ApiStandardResponses({ ok: 'Aplicaciones asignadas exitosamente.', badRequest: true })
  async assignApplicationsToCompanies(
    @Body() dto: { companyIds: string[]; applicationIds: string[] },
  ) {
    return this.assignApplicationToCompaniesUseCase.execute(dto.companyIds, dto.applicationIds);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una compañía' })
  @ApiParam({ name: 'id', description: 'UUID de la compañía' })
  @ApiStandardResponses({ notFound: 'Compañía no encontrada.' })
  async deleteCompany(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteCompanyUseCase.execute(id);
    return;
  }
}
