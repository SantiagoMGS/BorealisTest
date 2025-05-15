import { IMiningTitleResponse } from '@domain/interfaces/supplier/mining-title-response.interface';
import { SupplierMiningTitleWithRelations } from '@infrastructure/datasource/mining-title/mining-title.datasource.types';

export class MiningTitleMapper {
  static toDomain(mt: SupplierMiningTitleWithRelations): IMiningTitleResponse {
    return {
      id: mt.id,
      name: mt.name,
      mineTypeId: mt.mineType.id,
      mineTypeName: mt.mineType.name,
      royaltyPercentage: '',
      cityId: mt.city.id,
      cityName: mt.city.name,
      departmentId: mt.city.department.id,
      departmentName: mt.city.department.name,
    };
  }

  static toDomainList(
    mts: SupplierMiningTitleWithRelations[],
  ): IMiningTitleResponse[] {
    return mts.map(this.toDomain);
  }
}
