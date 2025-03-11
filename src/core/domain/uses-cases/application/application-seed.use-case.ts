import { Inject, Injectable } from '@nestjs/common';
import { Application } from '../../entities/applicaiton.entity';
import { actionInitialData } from 'src/infrastructure/prisma/seed/application.seed';
import { IApplicationRepository } from '../../repositories/application.repository';

@Injectable()
export class ApplicationSeedUseCase {

  constructor(@Inject('IApplicationRepository') private readonly applicationRepository: IApplicationRepository) {
  }

  async execute(): Promise<Application[]> {
    const  application: Application[] =
      actionInitialData.map( application =>
        new Application(
          '',
          application.name,
          true // or false, depending on your logic
        )
      );
   
    await this.applicationRepository.createApplication(application);
    return application;
  }
}