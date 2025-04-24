import { Injectable } from '@nestjs/common';
import { AssignSuppliersDto } from '@domain/dtos/company-supplier/assign-suppliers.dto';
import { CompanySupplierRepositoryImpl } from '@infrastructure/repositories/company-supplier/company-supplier.repository';

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
