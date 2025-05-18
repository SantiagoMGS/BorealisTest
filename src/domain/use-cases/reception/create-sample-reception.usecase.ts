import { Injectable } from '@nestjs/common';
import { SampleReceptionRepository } from '@domain/repositories/reception/sample-reception.repository';
import { IReceptionEntity } from '@domain/entities';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { FindSupplierByIdUseCase } from '../supplier/find-supplier-by-id.use-case';
import { FindReceptionOriginByIdUseCase } from '../reception-origin/find-recepion-origin-by-id.use-case';
import { GenerateSampleCodeUseCase } from './generate-sample-code.use-case';

@Injectable()
export class CreateReceptionUseCase {
  constructor(
    private readonly receptionRepository: SampleReceptionRepository,
    private readonly generateSampleCodeUseCase: GenerateSampleCodeUseCase,
  ) {}

  async execute(reception: IReceptionEntity): Promise<IReceptionResponse> {
    await Promise.all(reception.samples.map(async (sample) => {
      const code = await this.generateSampleCodeUseCase.execute(sample, reception.supplierId);
      console.log(code);
    }));

    return this.receptionRepository.createReception(reception);
  }
}
