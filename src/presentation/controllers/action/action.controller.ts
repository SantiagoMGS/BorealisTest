import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionSeedUseCase } from 'src/core/domain/uses-cases/action/action-seed.use-case';

@ApiTags('Acciones')
@Controller('action')
export class ActionController {
  private logger = new Logger(ActionController.name);

  constructor(private readonly actionSeedUseCase: ActionSeedUseCase) { }

  @Post('execute-action-seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ejecutar seed de acciones' })
  @ApiStandardResponses({
    ok: 'Seed de acciones ejecutado exitosamente.',
    badRequest: false,
  })
  async executeActionSeed() {
    try {
      await this.actionSeedUseCase.execute();
      this.logger.log('✅ Seed de acciones ejecutado exitosamente');
      return { response: '✅ Seed de acciones ejecutado' };
    } catch (error) {
      this.logger.error('❌ Error al ejecutar el seed de acciones:', error);
      throw error;
    }
  }
}
