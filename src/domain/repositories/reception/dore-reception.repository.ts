import { IDoreReceptionEntity } from '@domain/entities/reception';
import { IDoreReceptionResponse } from '@domain/interfaces/reception';

export abstract class DoreReceptionRepository {
  abstract createDoreReception(
    doreReception: IDoreReceptionEntity,
  ): Promise<IDoreReceptionResponse>;

  abstract findLastBatchNumberBySupplierId(
    supplierId: string,
    prefix: string,
  ): Promise<string | null>;
}
