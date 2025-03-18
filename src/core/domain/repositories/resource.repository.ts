import { Resource } from "../entities";

export interface IResourceRepository {
  createResource(resource: Resource): Promise<Resource>;
  findById(id: string): Promise<Resource | null>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ resources: Resource[]; total: number }>;
  updateResource(
    id: string,
    resourceData: Partial<Resource>,
  ): Promise<Resource>;
  deleteResource(id: string): Promise<void>;
  findByName(name: string): Promise<Resource | null>;
}
