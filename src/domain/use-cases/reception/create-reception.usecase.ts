import { Injectable } from '@nestjs/common';
import { ReceptionRepository } from '@domain/repositories/reception/reception.repository';
import { IReceptionEntity } from '@domain/entities';
import { IReceptionResponse } from '@domain/interfaces/reception';

@Injectable()
export class CreateReceptionUseCase {
  constructor(private readonly receptionRepository: ReceptionRepository) {}

  async execute(reception: IReceptionEntity): Promise<IReceptionResponse> {
    return this.receptionRepository.createReception(reception);
  }
}
