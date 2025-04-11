import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplicationSeedUseCase } from 'src/core/domain/uses-cases/application/application-seed.use-case';

@ApiTags('Aplicaciones')
@Controller('application')
export class ApplicationController {
  private logger = new Logger(ApplicationController.name);

  constructor(private readonly applicationSeedUseCase: ApplicationSeedUseCase) { }

  @Post('execute-seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ejecutar seed de aplicaciones' })
  @ApiStandardResponses({
    ok: 'Seed de aplicaciones ejecutado exitosamente.',
    badRequest: false,
  })
  async executeApplicationSeed() {
    try {
      await this.applicationSeedUseCase.execute();
      this.logger.log('✅ Seed de aplicaciones ejecutado exitosamente');
      return { message: '✅ Seed de aplicaciones ejecutado exitosamente' };
    } catch (error) {
      this.logger.error('❌ Error al ejecutar el seed de aplicaciones:', error);
      throw error;
    }
  }
}
