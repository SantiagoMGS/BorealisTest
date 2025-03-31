import { Application } from "../entities";

export interface IApplicationRepository {
  createApplication(application: Application[]): Promise<Application[]>;
  findById(applicationId: string): Promise<Application | null>;
  findManyByIds(applicationIds: string[]): Promise<Application[]>;
  findByName(name: string): Promise<Application | null>;
}
