import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from "@nestjs/common";
import { CreateResourceUseCase } from "src/core/domain/uses-cases/resource/create-resource.use-case";
import { CreateResourceDto } from "./dtos/create-resource.dto";
import { UpdateResourceDto } from "./dtos/update-resource.dto";
import { DeleteResourceUseCase } from "src/core/domain/uses-cases/resource/delete-resource.use-case";
import { UpdateResourceUseCase } from "src/core/domain/uses-cases/resource/update-resource.use-case";
import { GetAllResourcesUseCase } from "src/core/domain/uses-cases/resource/get-all-resorce.use-case";
import { GetByIdResourceUseCase } from "src/core/domain/uses-cases/resource/get-resoure.use-case";

@Controller('api/resource')
export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase,
    private readonly updateResourceUseCase: UpdateResourceUseCase,
    private readonly deleteResourceUseCase: DeleteResourceUseCase,
    private readonly findByIdResourceUseCase: GetByIdResourceUseCase,
    private readonly findAllResourcesUseCase: GetAllResourcesUseCase,
  ) { }


  @Post('create-resource')
  async createResource(@Body() createResourceDto: CreateResourceDto) {
    return this.createResourceUseCase.execute(createResourceDto);
  }

  @Get()
  async getAllResources(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.findAllResourcesUseCase.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async getResourceById(@Param('id') id: string) {
    const resource = await this.findByIdResourceUseCase.execute(id);
    if (!resource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    return resource;
  }
  @Put(':id')
  async updateResource(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.updateResourceUseCase.execute(id, updateResourceDto);
  }

  @Delete(':id')
  async deleteResource(@Param('id') id: string) {
    return this.deleteResourceUseCase.execute(id);
  }

}
