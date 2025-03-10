import { Body, Controller, Post } from "@nestjs/common";
import { CreateCompanyUseCase } from "src/core/domain/uses-cases/company/create-company.use-case";
import { CreateCompanyDto } from "../dtos/create-company.dto";

@Controller('api/company')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase
  ) { }

  @Post('create-company')
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyUseCase.execute(createCompanyDto);
  }

}
