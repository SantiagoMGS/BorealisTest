import { Inject, Injectable, Logger } from '@nestjs/common';
import { actionInitialData } from 'src/infrastructure/prisma/seed';
import { Action } from '../../entities';
import { IActionRepository } from '../../repositories/action.repository';

@Injectable()
export class ActionSeedUseCase {
  private readonly logger = new Logger(ActionSeedUseCase.name);

  constructor(@Inject('IActionRepository') private readonly actionRepository: IActionRepository) { }

  async execute(): Promise<Action[]> {
    this.logger.log('Executing action seed');
    const actions = await Promise.all(
      actionInitialData.map(async (a) => {
        try {
          const newAction: Action = { id: '', name: a.name, level: a.level };
          return await this.actionRepository.createActions([newAction]);
        } catch (error) {
          this.logger.error('Failed to execute action seed', (error as Error).stack);
          throw error;
        }
      })
    )
    return actions.flat()
  }
}