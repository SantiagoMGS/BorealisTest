import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GetCatalogsUseCase } from '@domain/use-cases/catalog';
import { CatalogResponseDto, CatalogType, CatalogParamDto } from './dtos';
import { ResponseInterceptor } from '@core/interceptores/response.interceptor';
import { CustomResponse } from '@core/decorators/custom-response.decorator';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CatalogMapper } from './mappers/catalog.mapper';

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
    @Param('type') type: CatalogType,
  ): Promise<{ data: any[] }> {
    const items = await this.getCatalogsUseCase.execute(type);

    let data: any[] = [];

    // Aplicar mappers específicos según el tipo de catálogo
    switch (type) {
      case CatalogType.DOCUMENT_TYPES:
        data = items.map((item) => CatalogMapper.documentTypeToDto(item));
        break;
      case CatalogType.SUPPLIERS:
        data = items.map((item) => CatalogMapper.supplierToDto(item));
        break;
      case CatalogType.RECEPTION_TYPES:
        data = items.map((item) => CatalogMapper.receptionTypeToDto(item));
        break;
      case CatalogType.RECEPTION_ORIGINS:
        data = items.map((item) => CatalogMapper.receptionOriginToDto(item));
        break;
      case CatalogType.ANALYSIS_TYPES:
        data = items.map((item) => CatalogMapper.analysisTypeToDto(item));
        break;
      default:
        data = items;
    }

    return { data };
  }
}
