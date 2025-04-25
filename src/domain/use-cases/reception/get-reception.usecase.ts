import { Injectable } from '@nestjs/common';
import { ReceptionRepository } from '@domain/repositories/reception/reception.repository';
import { IReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class GetReceptionUseCase {
  constructor(private readonly receptionRepository: ReceptionRepository) {}

  async executeGetAll(
    companyId?: string,
    supplierId?: string,
  ): Promise<IReceptionResponse[]> {
    const result = await this.receptionRepository.getReceptions(
      companyId,
      supplierId,
    );
    return result.data;
  }

  async execute(id: string, companyId: string): Promise<IReceptionResponse> {
    return this.receptionRepository.getReceptionById(id, companyId);
  }
}
