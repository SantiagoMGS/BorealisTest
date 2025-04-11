import { Inject, Injectable, Logger } from '@nestjs/common';
import { applicationInitialData } from 'src/infrastructure/prisma/seed';
import { Application } from '../../entities';
import { IApplicationRepository } from '../../repositories/application.repository';

@Injectable()
export class ApplicationSeedUseCase {
  private readonly logger = new Logger(ApplicationSeedUseCase.name);

  constructor(
    @Inject('IApplicationRepository')
    private readonly applicationRepository: IApplicationRepository,
  ) { }

  async execute(): Promise<Application[]> {
    this.logger.log('Executing application seed');

    try {
      const applications: Application[] = applicationInitialData.map(
        (application) => ({
          id: '',
          name: application.name,
          isActive: true,
          logo: application.logo,
          path: application.path,
        }),
      );

      await this.applicationRepository.createApplication(applications);
      this.logger.log('Application seed executed successfully');
      return applications;
    } catch (error) {
      this.logger.error('Failed to execute application seed', (error as Error).stack);
      throw error;
    }
  }
}
