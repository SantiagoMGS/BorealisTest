import { Application } from "../entities";

export interface IApplicationRepository {
  createApplication(applicaiton: Application[]): Promise<Application[]>;
  findById(applicationId: string): Promise<Application | null>;
  findManyByIds(applicationIds: string[]): Promise<Application[]>;
  findByName(name: string): Promise<Application | null>;
}
