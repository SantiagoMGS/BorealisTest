import { Action } from "../entities/action.entity";

export interface IActionRepository {
  createActions(actions: Action[]): Promise<Action[]>; 
}
