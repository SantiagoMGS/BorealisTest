import { Injectable } from '@nestjs/common';
import { CompanySupplierRepositoryImpl } from '@infrastructure/repositories/company-supplier/company-supplier.repository';
import { AssignSuppliersDto } from '@presentation/controllers/company/dtos';
import { ISuppliersAssignmentResult } from '@domain/interfaces/company-supplier';

@Injectable()
export class AssignSuppliersUseCase {
  constructor(
    private readonly companySupplierRepository: CompanySupplierRepositoryImpl,
  ) {}

  async execute(
    dto: AssignSuppliersDto,
    companyId: string,
  ): Promise<ISuppliersAssignmentResult> {
    return await this.companySupplierRepository.assignSuppliers(
      companyId,
      dto.supplierIds,
    );
  }
}
