import { Injectable } from '@nestjs/common';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';

@Injectable()
export class DeleteDoreReceptionUseCase {
  constructor(
    private readonly doreReceptionRepository: DoreReceptionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.doreReceptionRepository.deleteDoreReception(id);
  }
}
