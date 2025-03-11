import { Controller, Post, HttpCode, HttpStatus, Logger } from "@nestjs/common";
import { ApplicationSeedUseCase } from "src/core/domain/uses-cases/application/application-seed.use-case";

@Controller('application') 
export class ApplicationController {
  constructor(
    private readonly applicationSeedUseCase: ApplicationSeedUseCase
  ) {}

  @Post('execute-seed')
  @HttpCode(HttpStatus.OK)
  async executeApplicationSeed() {
    try {
      await this.applicationSeedUseCase.execute();
      Logger.log('✅ Application seed executed successfully');
      return { message: '✅ Application seed executed successfully' };
    } catch (error) {
      Logger.error('❌ Error executing application seed:', error);
      throw error;
    }
  }
}
