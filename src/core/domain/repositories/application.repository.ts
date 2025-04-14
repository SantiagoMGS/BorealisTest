import { Application } from '../entities';
import { IRepository } from './common/repository.interface';

export interface IApplicationRepository extends IRepository<Application> {
  findByName(name: string): Promise<Application | null>;
  findManyByIds(ids: string[]): Promise<Application[]>;
}
