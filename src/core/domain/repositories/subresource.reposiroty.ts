import { SubResource } from "../entities";

export interface ISubResourceRepository {
  createSubResource(subResource: SubResource): Promise<SubResource>;
  findByName(name: string): Promise<SubResource | null>;
 
}
