import { SampleSelectAllFields } from '@infrastructure/datasource/reception/types/sample-select.type';
import { Injectable } from '@nestjs/common';
import { SampleRepository } from '@domain/repositories/sample/sample.repository';

@Injectable()
export class FindSampleByIdUseCase {
  constructor(private readonly sampleRepository: SampleRepository) {}

  async execute(id: string): Promise<SampleSelectAllFields> {
    return await this.sampleRepository.findById(id);
  }
}
