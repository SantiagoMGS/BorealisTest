import { Resource } from '../entities/resource.entity';
import { IRepository } from './common/repository.interface';

export interface IResourceRepository extends IRepository<Resource> {
  findByName(name: string): Promise<Resource | null>;
}
