import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { Injectable } from '@nestjs/common';
import { SampleDetailSelect } from '@infrastructure/datasource/management/types/sample-detail-select.type';
import { SampleDetailResponseDto } from '@presentation/controllers/management/dtos/sample-detail-response.dto';
import { SampleDetailMapper } from '@infrastructure/mappers/sample-detail.mapper';

@Injectable()
export class SampleDetailUseCase {
  constructor(
    private readonly sampleManagementRepository: SampleManagementRepository,
  ) {}

  async execute(id: string): Promise<SampleDetailResponseDto> {
    const sample = await this.sampleManagementRepository.getDetailSample(id);
    return SampleDetailMapper.toDto(sample);
  }
}
