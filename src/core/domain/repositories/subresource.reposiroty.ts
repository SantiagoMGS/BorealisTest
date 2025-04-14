import { Subresource } from "../entities";
import { IWriteOnlyRepository } from "./common/write-only.repository";

export interface ISubResourceRepository extends IWriteOnlyRepository<Subresource> {
  findByName(name: string): Promise<Subresource | null>;
}