import { Inject, Injectable, Logger } from '@nestjs/common';
import { Application } from '../../entities/application.entity';
import { actionInitialData } from 'src/infrastructure/prisma/seed/application.seed';
import { IApplicationRepository } from '../../repositories/application.repository';

@Injectable()
export class ApplicationSeedUseCase {
  private readonly logger = new Logger(ApplicationSeedUseCase.name);

  constructor(@Inject('IApplicationRepository') private readonly applicationRepository: IApplicationRepository) {}

  async execute(): Promise<Application[]> {
    this.logger.log('Executing application seed');

    try {
      const applications: Application[] = actionInitialData.map(application =>
        new Application('', application.name, true)
      );

      await this.applicationRepository.createApplication(applications);
      this.logger.log('Application seed executed successfully');
      return applications;
    } catch (error) {
      this.logger.error('Failed to execute application seed', error.stack);
      throw error;
    }
  }
}