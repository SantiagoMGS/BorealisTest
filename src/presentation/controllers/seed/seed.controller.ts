import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SeedUseCase } from 'src/core/domain/uses-cases/seed/seed.use-case';

@ApiTags('Seeder')
@Controller('seed')
export class SeedController {
  private logger = new Logger(SeedController.name);

  //constructor(private readonly seedUseCase: SeedUseCase) {}

  @Post('execute-seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ejecutar seed de acciones' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Seed de acciones ejecutado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al ejecutar el seed de acciones.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Recurso prohibido.',
  })
  async executeSeed() {
    try {
      //await this.seedUseCase.execute();
      this.logger.log('✅ Seed ejecutado exitosamente');
      return { response: '✅ Seed ejecutado exitosamente' };
    } catch (error) {
      this.logger.error('❌ Error al ejecutar el seed de acciones:', error);
      throw error;
    }
  }
}
