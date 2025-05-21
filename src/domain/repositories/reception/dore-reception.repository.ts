import { IDoreReceptionEntity } from '@domain/entities/reception';
import { IDoreReceptionResponse } from '@domain/interfaces/reception';
import { UpdateDoreReceptionDto } from '@presentation/controllers/management/dtos/update-dore-reception.dto';

export abstract class DoreReceptionRepository {
  abstract createDoreReception(
    doreReception: IDoreReceptionEntity,
  ): Promise<IDoreReceptionResponse>;

  abstract findLastBatchNumberBySupplierId(
    supplierId: string,
    prefix: string,
  ): Promise<string | null>;

  abstract deleteDoreReception(id: string): Promise<void>;

  abstract updateDoreReception(
    updateData: UpdateDoreReceptionDto,
  ): Promise<IDoreReceptionResponse>;
}
