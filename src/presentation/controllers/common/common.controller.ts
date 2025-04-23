import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GetCatalogsUseCase } from '@domain/use-cases/catalog';
import { CatalogResponseDto, CatalogType } from './dtos';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CatalogMapper } from './mappers/catalog.mapper';
import { CatalogTypeEnum } from '@domain/entities/catalog/catalog.entity';

@ApiTags('Catálogos')
@Controller('common')
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class CommonController {
  constructor(private readonly getCatalogsUseCase: GetCatalogsUseCase) {}

  @Get('catalogs/:type')
  @ApiOperation({ summary: 'Obtener catálogos del sistema' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'type',
    type: 'string',
    enum: CatalogType,
    description: 'Tipo de catálogo a obtener',
  })
  @ApiOkResponse({
    description: 'Catálogo obtenido correctamente',
    type: CatalogResponseDto,
  })
  @CustomResponse({
    successMessage: 'Catálogo obtenido correctamente',
  })
  async getCatalogs(
    @Param('type') type: CatalogTypeEnum,
  ): Promise<{ data: any[] }> {
    // Validamos que el tipo de catálogo sea válido
    if (!Object.values(CatalogTypeEnum).includes(type)) {
      throw new BadRequestException(`Tipo de catálogo '${type}' no válido`);
    }

    // Obtenemos los elementos del catálogo usando el caso de uso
    const items = await this.getCatalogsUseCase.execute(type);

    // Obtenemos el mapper adecuado para este tipo de catálogo
    const mapper = CatalogMapper.getMapper(type);

    // Aplicamos el mapper a cada elemento
    const data = items.map((item) => mapper(item));

    return { data };
  }
}
