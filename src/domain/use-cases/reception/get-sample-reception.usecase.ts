import { Injectable } from '@nestjs/common';
import { SampleReceptionRepository } from '@domain/repositories/reception/sample-reception.repository';
import { IReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class GetReceptionUseCase {
  constructor(
    private readonly sampleReceptionRepository: SampleReceptionRepository,
  ) {}

  async executeGetAll(
    companyId?: string,
    supplierId?: string,
  ): Promise<IReceptionResponse[]> {
    const result = await this.sampleReceptionRepository.getReceptions(
      companyId,
      supplierId,
    );
    return result.data;
  }

  async execute(id: string, companyId: string): Promise<IReceptionResponse> {
    return this.sampleReceptionRepository.getReceptionById(id, companyId);
  }
}
