import { Application } from '../entities/application.entity';

export interface IApplicationRepository {
  createApplication(applicaiton: Application[]): Promise<Application[]>;
  findById(applicationId: string): Promise<Application | null>;
  findManyByIds(applicationIds: string[]): Promise<Application[]>;
  findByName(name: string): Promise<Application | null>;
}
