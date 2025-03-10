import {  Inject, Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../../repositories/company.repository';
import { Company } from '../../entities/company.entity';
import { CreateCompanyDto } from 'src/presentation/controllers/dtos/create-company.dto';

@Injectable()
export class CreateCompanyUseCase {
  constructor(@Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository) { }


  async execute(companyDto: CreateCompanyDto): Promise<Company> {
    const newCompany = new Company(
      crypto.randomUUID(),
      companyDto.name,
      companyDto.logo
    );
    return this.companyRepository.createCompany(newCompany);
  }
}