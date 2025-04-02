import { Subresource } from "../entities";

export interface ISubResourceRepository {
  createSubResource(subResource: Subresource): Promise<Subresource>;
  findByName(name: string): Promise<Subresource | null>;
 
}
