import { Injectable } from '@nestjs/common';
import { SampleReceptionRepository } from '@domain/repositories/reception/sample-reception.repository';

@Injectable()
export class DeleteSampleReceptionUseCase {
  constructor(
    private readonly sampleReceptionRepository: SampleReceptionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.sampleReceptionRepository.deleteReception(id);
  }
}
