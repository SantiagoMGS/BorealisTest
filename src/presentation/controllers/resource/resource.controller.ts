import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, HttpCode, HttpStatus, Logger, ParseIntPipe, ParseUUIDPipe } from "@nestjs/common";
import { CreateResourceUseCase } from "src/core/domain/uses-cases/resource/create-resource.use-case";
import { CreateResourceDto } from "./dtos/create-resource.dto";
import { UpdateResourceDto } from "./dtos/update-resource.dto";
import { DeleteResourceUseCase } from "src/core/domain/uses-cases/resource/delete-resource.use-case";
import { UpdateResourceUseCase } from "src/core/domain/uses-cases/resource/update-resource.use-case";
import { GetAllResourcesUseCase } from "src/core/domain/uses-cases/resource/get-all-resorce.use-case";
import { GetByIdResourceUseCase } from "src/core/domain/uses-cases/resource/get-resoure.use-case";

@Controller('resource')
export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase,
    private readonly updateResourceUseCase: UpdateResourceUseCase,
    private readonly deleteResourceUseCase: DeleteResourceUseCase,
    private readonly findByIdResourceUseCase: GetByIdResourceUseCase,
    private readonly findAllResourcesUseCase: GetAllResourcesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createResource(@Body() createResourceDto: CreateResourceDto) {
    return this.createResourceUseCase.execute(createResourceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllResources(@Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10) {
    return this.findAllResourcesUseCase.execute(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getResourceById(@Param('id', ParseUUIDPipe) id: string) {
    const resource = await this.findByIdResourceUseCase.execute(id);
    if (!resource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    return resource;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateResource(@Param('id', ParseUUIDPipe) id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.updateResourceUseCase.execute(id, updateResourceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteResource(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteResourceUseCase.execute(id);
  }
}
