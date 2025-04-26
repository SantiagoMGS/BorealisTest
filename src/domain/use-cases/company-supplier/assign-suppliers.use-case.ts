import { Injectable } from '@nestjs/common';
import { CompanySupplierRepositoryImpl } from '@infrastructure/repositories/company-supplier/company-supplier.repository';
import { AssignSuppliersDto } from '@presentation/controllers/company/dtos';

@Injectable()
export class AssignSuppliersUseCase {
  constructor(
    private readonly companySupplierRepository: CompanySupplierRepositoryImpl,
  ) {}

  async execute(dto: AssignSuppliersDto): Promise<void> {
    await this.companySupplierRepository.assignSuppliers(
      dto.companyId,
      dto.supplierIds,
    );
  }
}
