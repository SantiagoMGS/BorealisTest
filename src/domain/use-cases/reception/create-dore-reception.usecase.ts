import { Injectable } from '@nestjs/common';
import { IDoreReceptionEntity } from '@domain/entities/reception';
import { DoreReceptionRepository } from '@domain/repositories/reception';

@Injectable()
export class CreateDoreReceptionUseCase {
  constructor(
    private readonly doreReceptionRepository: DoreReceptionRepository,
  ) {}

  async execute(reception: IDoreReceptionEntity): Promise<any> {
    return await this.doreReceptionRepository.createDoreReception(reception);
  }
}
