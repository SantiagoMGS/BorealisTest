import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, HttpCode, HttpStatus, Logger } from "@nestjs/common";
import { ActionSeedUseCase } from "src/core/domain/uses-cases/action/action-seed.use-case";

@ApiTags('Acciones')
@Controller('action')
export class ActionController {
  private logger = new Logger(ActionController.name);
  
  constructor(
    private readonly actionSeedUseCase: ActionSeedUseCase
  ) { }

  @Post('execute-action-seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ejecutar seed de acciones' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Seed de acciones ejecutado exitosamente.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error al ejecutar el seed de acciones.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
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