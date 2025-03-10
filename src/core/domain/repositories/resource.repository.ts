import { Resource } from "../entities/resource.entity";

export interface IResourceRepository {
  createResource(resource: Resource): Promise<Resource>;
  deleteResource(id: string): Promise<void>;
  updateResource(id: string, userResource: Partial<Resource>): Promise<Resource>;
}