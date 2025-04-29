import { Injectable } from '@nestjs/common';
import { SampleReceptionRepository } from '@domain/repositories/reception/sample-reception.repository';
import { IReceptionEntity } from '@domain/entities';
import { IReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class CreateReceptionUseCase {
  constructor(
    private readonly receptionRepository: SampleReceptionRepository,
  ) {}

  async execute(reception: IReceptionEntity): Promise<IReceptionResponse> {
    return this.receptionRepository.createReception(reception);
  }
}
