import { Injectable } from '@nestjs/common';
import { ReceptionOriginRepository } from '@domain/repositories/reception';

@Injectable()
export class FindReceptionOriginByIdUseCase {
  constructor(
    private readonly receptionOriginRepository: ReceptionOriginRepository,
  ) {}

  async execute(id: string): Promise<any> {
    return this.receptionOriginRepository.findById(id);
  }
}
