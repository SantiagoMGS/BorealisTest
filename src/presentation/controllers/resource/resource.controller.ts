import { Body, Controller, Post } from "@nestjs/common";
import { CreateResourceUseCase } from "src/core/domain/uses-cases/resource/create-resource.use-case";
import { CreateResourceDto } from "./dtos/create-resource.dto";

@Controller('api/resource')
export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase
  ) { }


  @Post('create-resource')
  async createResource(@Body() createResourceDto: CreateResourceDto) {
    return this.createResourceUseCase.execute(createResourceDto);
  }

}
