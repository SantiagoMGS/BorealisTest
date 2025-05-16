import { SampleRepository } from '@domain/repositories/sample/sample.repository';
import { Injectable } from '@nestjs/common';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception';
import { SampleSelectAllFields } from '@infrastructure/datasource/reception/types/sample-select.type';

@Injectable()
export class SampleRepositoryImplService extends SampleRepository {
  constructor(
    private readonly sampleDataSource: SampleReceptionDataSourceService,
  ) {
    super();
  }

  async findById(id: string): Promise<SampleSelectAllFields> {
    return await this.sampleDataSource.findById(id);
  }
}
