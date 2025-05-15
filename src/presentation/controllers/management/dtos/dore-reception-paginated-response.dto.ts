import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

class DoreStatusDto {
  @ApiProperty({ example: 'e24cfd09-01e4-400a-adb9-013b2917c34b' })
  id!: string;

  @ApiProperty({ example: 'RECIBIDO' })
  name!: string;
}

class DoreItemsDto {
  @ApiProperty({ example: '8ee8dc58-2c10-487b-96dc-21c5ff6310f8' })
  id!: string;

  @ApiProperty({ example: 30000 })
  code!: number;

  @ApiProperty({ example: '1250.75' })
  receivedWeight!: string | number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  base64!: string;

  @ApiProperty({ example: 'jpg' })
  format!: string;

  @ApiProperty({ type: DoreStatusDto })
  status!: DoreStatusDto;
}

class SupplierDto {
  @ApiProperty({ example: 'cddfc129-2111-4c06-b019-633c828f1fba' })
  id!: string;

  @ApiProperty({ example: 'Sofia Rodriguez - Joyería' })
  name!: string;
}

class ReceptionOriginDto {
  @ApiProperty({ example: 'f2f825a2-5613-4915-84ea-d56d405d839c' })
  id!: string;

  @ApiProperty({ example: 'Joyería Desuso' })
  name!: string;
}

export class DoreReceptionItemDto {
  @ApiProperty({ example: '4134b10f-af1e-4613-9974-69583b855300' })
  id!: string;

  @ApiProperty({ example: 'CM-D-2025-001' })
  batchNumber!: string | null;

  @ApiProperty({ example: '2025-04-05T00:00:00.000Z' })
  receptionDate!: Date;

  @ApiProperty({
    example: 'Piezas de joyería de oro para fundición, excelente calidad',
    required: false,
  })
  observation?: string | null;

  @ApiProperty({ type: [DoreItemsDto] })
  dore!: DoreItemsDto[];

  @ApiProperty({ type: SupplierDto })
  supplier!: SupplierDto;

  @ApiProperty({ type: ReceptionOriginDto })
  receptionOrigin!: ReceptionOriginDto;
}

export class DoreReceptionPaginatedResponseDto extends PaginatedResponseDto<DoreReceptionItemDto> {
  @ApiProperty({ type: [DoreReceptionItemDto] })
  declare items: DoreReceptionItemDto[];
}
