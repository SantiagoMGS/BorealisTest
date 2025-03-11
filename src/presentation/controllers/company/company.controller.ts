import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { CreateCompanyUseCase } from "src/core/domain/uses-cases/company/create-company.use-case";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import { AssignApplicationToCompaniesUseCase } from "src/core/domain/uses-cases/company/assign-application-to-companies.use-case";
import { DeleteCompanyUseCase } from "src/core/domain/uses-cases/company/delete-company.use-case";
import { GetByNameCompanyUseCase } from "src/core/domain/uses-cases/company/get-by-name-company.use-case";
import { GetAllCompaniesUseCase } from "src/core/domain/uses-cases/company/get-all-company.use-case";
import { GetByIdCompanyUseCase } from "src/core/domain/uses-cases/company/get-by-id-company.use-case";

@Controller('api/company')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly getByIdCompanyUseCase: GetByIdCompanyUseCase,
    private readonly getAllCompaniesUseCase: GetAllCompaniesUseCase,
    private readonly getByNameCompanyUseCase: GetByNameCompanyUseCase,
    private readonly assignApplicationToCompaniesUseCase: AssignApplicationToCompaniesUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase  ) { }

  @Post('create-company')
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyUseCase.execute(createCompanyDto);
  }
  @Get()
  async getAllCompanies(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.getAllCompaniesUseCase.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    const company = await this.getByIdCompanyUseCase.execute(id);
    if (!company) throw new NotFoundException(`Compañía con ID ${id} no encontrada`);
    return company;
  }

  @Get('name/:name')
  async getCompanyByName(@Param('name') name: string) {
    const company = await this.getByNameCompanyUseCase.execute(name);
    if (!company) throw new NotFoundException(`Compañía con nombre ${name} no encontrada`);
    return company;
  }

  @Post('assign-applications')
  async assignApplicationsToCompanies(
    @Body() assignDto: { companyIds: string[], applicationIds: string[] }
  ) {
    return this.assignApplicationToCompaniesUseCase.execute(assignDto.companyIds, assignDto.applicationIds);
  }

  @Delete(':id')
  async deleteCompany(@Param('id') id: string) {
    return this.deleteCompanyUseCase.execute(id);
  }

}
