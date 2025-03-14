import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, HttpCode, HttpStatus, Logger } from "@nestjs/common";
import { ApplicationSeedUseCase } from "src/core/domain/uses-cases/application/application-seed.use-case";

@ApiTags('Aplicaciones')
@Controller('application') 
export class ApplicationController {
  private logger = new Logger(ApplicationController.name);
  constructor(
    private readonly applicationSeedUseCase: ApplicationSeedUseCase
  ) {}

  @Post('execute-seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ejecutar seed de aplicaciones' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Seed de aplicaciones ejecutado exitosamente.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error al ejecutar el seed de aplicaciones.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Recurso prohibido.' })
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