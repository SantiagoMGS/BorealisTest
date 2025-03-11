import { Application } from "../entities/applicaiton.entity";

export interface IApplicationRepository {
  createApplication(applicaiton: Application[]): Promise<Application[]>; 
  findById(applicationId: string): Promise<Application | null>;
  findManyByIds(applicationIds: string[]): Promise<Application[]>;
}
