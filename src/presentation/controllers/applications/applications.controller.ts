import { Controller, Post } from "@nestjs/common";
import { ApplicationSeedUseCase } from "src/core/domain/uses-cases/application/application-seed.use-case";

@Controller('api/application')
export class ApplicationController {
  constructor(
    private readonly applicationSeedUseCase: ApplicationSeedUseCase
  ) { }


  @Post('execute-application-seed')
  async executeApplicationSeed() {
    this.applicationSeedUseCase.execute();
    return { response: '✅ Application seed executed' };
  }
}
