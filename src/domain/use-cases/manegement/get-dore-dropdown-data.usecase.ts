import { Injectable } from '@nestjs/common';
import { IDoreDropdownData } from '@domain/interfaces/management/dore-management.interface';
import { DoreManagementRepository } from '@domain/repositories/management/dore-management.repository';

@Injectable()
export class GetDoreDropdownDataUseCase {
  constructor(
    private readonly doreManagementRepository: DoreManagementRepository,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<IDoreDropdownData> {
    return this.doreManagementRepository.getDropdownData(startDate, endDate);
  }
}
