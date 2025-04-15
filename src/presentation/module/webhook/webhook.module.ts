import { Module } from '@nestjs/common';
import { WebhookController } from '../../controllers';
import { RepositoryModule } from '../repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [WebhookController],
  providers: [],
  exports: [],
})
export class WebhookModule {} 