import { Inject, Injectable, Logger } from '@nestjs/common';
import { IActionRepository } from '../../repositories/action.repository';
import { Action } from '../../entities';
import { actionInitialData } from 'src/infrastructure/prisma/seed';

@Injectable()
export class ActionSeedUseCase {
  private readonly logger = new Logger(ActionSeedUseCase.name);

  constructor(@Inject('IActionRepository') private readonly actionRepository: IActionRepository) { }

  async execute(): Promise<Action[]> {
    this.logger.log('Executing action seed');

    try {
      const actions: Action[] = actionInitialData.map(action =>
        new Action('', action.name, action.level)
      );

      await this.actionRepository.createActions(actions);
      this.logger.log('Action seed executed successfully');
      return actions;
    } catch (error) {
      this.logger.error('Failed to execute action seed', error.stack);
      throw error;
    }
  }
}