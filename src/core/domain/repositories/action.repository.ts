import { Action } from "../entities";

export interface IActionRepository {
  createActions(actions: Action[]): Promise<Action[]>;
  findByName(name: string): Promise<Action | null>;
}
