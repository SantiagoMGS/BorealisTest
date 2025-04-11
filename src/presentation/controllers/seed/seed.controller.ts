import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeedUseCase } from 'src/core/domain/uses-cases/seed/seed.use-case';

@ApiTags('Seeder')
@Controller('seed')
export class SeedController {
  private logger = new Logger(SeedController.name);

  constructor(private readonly seedUseCase: SeedUseCase) { }

  @Post('execute-seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ejecutar seed completo del sistema' })
  @ApiStandardResponses({
    ok: 'Seed ejecutado exitosamente.',
    badRequest: false, // no se espera un 400
  })
  async executeSeed() {
    try {
      await this.seedUseCase.execute();
      this.logger.log('✅ Seed ejecutado exitosamente');
      return { response: '✅ Seed ejecutado exitosamente' };
    } catch (error) {
      this.logger.error('❌ Error al ejecutar el seed de acciones:', error);
      throw error;
    }
  }
}
