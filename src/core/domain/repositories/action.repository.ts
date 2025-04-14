import { Action } from '../entities/action.entity';
import { IWriteOnlyRepository } from './common/write-only.repository';

export interface IActionRepository extends IWriteOnlyRepository<Action> {
  findByName(name: string): Promise<Action | null>;
}
