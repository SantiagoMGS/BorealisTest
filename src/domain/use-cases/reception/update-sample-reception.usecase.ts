import { Injectable } from '@nestjs/common';
import {
  SampleReceptionRepository,
  UpdateSampleFilter,
} from '@domain/repositories/reception/sample-reception.repository';
import { IReceptionEntity } from '@domain/entities/reception/reception.entity';
import { IReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class UpdateSampleReceptionUseCase {
  constructor(
    private readonly sampleReceptionRepository: SampleReceptionRepository,
  ) {}

  async execute(
    id: string,
    updateData: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse> {
    return this.sampleReceptionRepository.updateReception(id, updateData);
  }

  async executeByFilter(
    filter: UpdateSampleFilter,
    updateData: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse[]> {
    return this.sampleReceptionRepository.updateSamplesByFilter(
      filter,
      updateData,
    );
  }
}
