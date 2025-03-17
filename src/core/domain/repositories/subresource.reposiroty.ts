import { SubResource } from "../entities/subresource.entity";

export interface ISubResourceRepository {
  createSubResource(subResource: SubResource): Promise<SubResource>;
  findByName(name: string): Promise<SubResource | null>;
 
}
