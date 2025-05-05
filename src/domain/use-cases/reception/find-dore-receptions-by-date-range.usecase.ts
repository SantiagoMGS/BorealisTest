import { Injectable } from '@nestjs/common';
import {
  DoreReceptionRepository,
  IDoreReceptionFilter,
} from '@domain/repositories/reception';

@Injectable()
export class FindDoreReceptionsByDateRangeUseCase {
  constructor(
    private readonly doreReceptionRepository: DoreReceptionRepository,
  ) {}

  async execute(filter: IDoreReceptionFilter): Promise<any> {
    return await this.doreReceptionRepository.findByDateRange(filter);
  }
}
