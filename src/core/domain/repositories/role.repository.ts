import { Role } from '../entities/role.entity';
import { IRepository } from './common/repository.interface';

export interface IRoleRepository extends IRepository<Role> {
  findByName(name: string): Promise<Role | null>;
}
