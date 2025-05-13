import { IMiningTitleResponse } from '@domain/interfaces/supplier';
import { MiningTitleResponseDto } from '../dtos';

export class MiningTitleMapper {
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

  static toResponseDtoList(
    miningTitles: IMiningTitleResponse[],
  ): MiningTitleResponseDto[] {
    return miningTitles.map(this.toResponseDto);
  }
}
