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
  ApiExtraModels,
} from '@nestjs/swagger';
import { GetCatalogsUseCase } from '@domain/use-cases/catalog';
import {
  CatalogResponseDto,
  CatalogType,
  DocumentTypeDto,
  SupplierDto,
  ReceptionTypeDto,
  AnalysisTypeDto,
  CityDto,
  DepartmentDto,
  DoreReceptionTypeDto,
  SampleReceptionTypeDto,
} from './dtos';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CatalogMapper } from './mappers/catalog.mapper';
import { CatalogTypeEnum } from '@domain/entities/catalog/catalog.entity';
import {
  ApiResponseDto,
  getResponseSchema,
  getArrayResponseSchema,
  getPrimitiveArrayResponseSchema,
} from '@shared/dtos/api-response.dto';

@ApiTags('Catálogos')
@Controller('common')
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
@ApiExtraModels(
  ApiResponseDto,
  DocumentTypeDto,
  SupplierDto,
  ReceptionTypeDto,
  AnalysisTypeDto,
  CityDto,
  DepartmentDto,
  DoreReceptionTypeDto,
  SampleReceptionTypeDto,
  CatalogResponseDto,
)
export class CommonController {
  constructor(private readonly getCatalogsUseCase: GetCatalogsUseCase) {}

  @Get('catalog-valid-options')
  @ApiOperation({ summary: 'Obtener tipos de catálogos disponibles' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Tipos de catálogos obtenidos correctamente',
    ...getPrimitiveArrayResponseSchema({
      type: 'string',
      enum: Object.values(CatalogTypeEnum),
    }),
  })
  @CustomResponse({
    successMessage: 'Tipos de catálogos obtenidos correctamente',
  })
  getCatalogTypes() {
    return Object.values(CatalogTypeEnum);
  }

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
    ...getResponseSchema(CatalogResponseDto),
  })
  @CustomResponse({
    successMessage: 'Catálogo obtenido correctamente',
  })
  async getCatalogs(@Param('type') type: CatalogTypeEnum) {
    if (!Object.values(CatalogTypeEnum).includes(type)) {
      throw new BadRequestException(`Tipo de catálogo '${type}' no válido`);
    }

    const items = await this.getCatalogsUseCase.execute(type);

    const mapper = CatalogMapper.getMapper(type);

    return items.map((item) => mapper(item));
  }
}
