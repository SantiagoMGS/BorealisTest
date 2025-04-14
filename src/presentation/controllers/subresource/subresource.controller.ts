import { ApiStandardResponses } from '@app/presentation/decorator/api-standard-response.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';
import { CreateSubResourceUseCase } from 'src/core/domain/uses-cases/subresource/create-subresource.use-case';
import { CreateSubResourceDto } from './dtos/create-subresource.dto';

@ApiTags('SubResources')
@Controller('subResource')
@UseGuards(AuthGuard('internal'), PermissionGuard)
export class SubResourceController {
  constructor(
    private readonly createSubresourceCase: CreateSubResourceUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo subrecurso' })
  @ApiBody({ type: CreateSubResourceDto })
  @ApiStandardResponses({
    created: true,
    badRequest: true,
  })
  async createResource(@Body() createSubResourceDto: CreateSubResourceDto) {
    return this.createSubresourceCase.execute(createSubResourceDto);
  }

  // Otros métodos están comentados. Cuando estén listos, aplica @ApiStandardResponses igual que arriba.
}
