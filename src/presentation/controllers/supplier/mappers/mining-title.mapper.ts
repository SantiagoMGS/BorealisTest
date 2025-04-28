import { IMiningTitleResponse } from '@domain/interfaces/supplier';
import { MiningTitleResponseDto } from '../dtos';

export class MiningTitleMapper {
  /**
   * Convierte una respuesta del dominio a un DTO de respuesta
   */
  static toResponseDto(
    miningTitle: IMiningTitleResponse,
  ): MiningTitleResponseDto {
    const responseDto = new MiningTitleResponseDto();
    responseDto.id = miningTitle.id;
    responseDto.name = miningTitle.name;
    responseDto.mineTypeId = miningTitle.mineTypeId;
    responseDto.mineTypeName = miningTitle.mineTypeName;
    responseDto.royaltyPercentage = miningTitle.royaltyPercentage;
    responseDto.cityId = miningTitle.cityId;
    responseDto.cityName = miningTitle.cityName;
    responseDto.departmentId = miningTitle.departmentId;
    responseDto.departmentName = miningTitle.departmentName;

    return responseDto;
  }

  /**
   * Convierte múltiples respuestas del dominio a DTOs de respuesta
   */
  static toResponseDtoList(
    miningTitles: IMiningTitleResponse[],
  ): MiningTitleResponseDto[] {
    return miningTitles.map(this.toResponseDto);
  }
}
