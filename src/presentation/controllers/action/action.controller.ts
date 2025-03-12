import { Controller, Post } from "@nestjs/common";
import { ActionSeedUseCase } from "src/core/domain/uses-cases/action/action-seed.use-case";

@Controller('action')
export class  ActionController {
  constructor(
    private readonly actionSeedUseCase: ActionSeedUseCase
  ) { }


  @Post('execute-action-seed')
  async executeActionSeed() {
    this.actionSeedUseCase.execute();
    return {response: '✅ Action seed executed'};
  }
 

}
