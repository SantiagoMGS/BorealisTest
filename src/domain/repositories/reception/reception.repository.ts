import { IReceptionEntity } from '@domain/entities/reception/reception.entity';
import { IReceptionResponse } from '@domain/interfaces/reception';

export abstract class ReceptionRepository {
  abstract createReception(
    reception: IReceptionEntity,
  ): Promise<IReceptionResponse>;

  abstract getReceptionById(id: string): Promise<IReceptionResponse>;

  abstract getReceptions(
    companyId?: string,
    supplierId?: string,
  ): Promise<{
    data: IReceptionResponse[];
    total: number;
  }>;

  abstract updateReception(
    id: string,
    reception: Partial<IReceptionEntity>,
  ): Promise<IReceptionResponse>;

  abstract deleteReception(id: string): Promise<void>;
}
