import { Inject, Injectable } from '@nestjs/common';
import { IActionRepository } from '../../repositories/action.repository';
import { Action } from '../../entities/action.entity';
import { actionInitialData } from 'src/infrastructure/prisma/seed/action.seed';

@Injectable()
export class ActionSeedUseCase {
  constructor(@Inject('IActionRepository') private readonly actionRepository: IActionRepository) { }


  async execute(): Promise<Action[]> {
    const actions: Action[] =
      actionInitialData.map(action =>
        new Action(
          '',
          action.name,
          action.level
        )
      );
   
    await this.actionRepository.createActions(actions);
    return actions;
  }
}