import { IMiningTitleResponse } from '@domain/interfaces/supplier';
import {
  SupplierMiningTitle,
  MineType,
  City,
  Department,
} from '@prisma/client';

type MiningTitleWithRelations = SupplierMiningTitle & {
  mineType: MineType;
  city: City & {
    department: Department;
  };
};

export class MiningTitlePersistenceMapper {
  static toDomain(miningTitle: MiningTitleWithRelations): IMiningTitleResponse {
    return {
      id: miningTitle.id,
      name: miningTitle.name,
      mineTypeId: miningTitle.mineTypeId,
      mineTypeName: miningTitle.mineType.name,
      royaltyPercentage: miningTitle.mineType.royaltyPercentage.toString(),
      cityId: miningTitle.cityId,
      cityName: miningTitle.city.name,
      departmentId: miningTitle.city.departmentId,
      departmentName: miningTitle.city.department.name,
    };
  }

  static toDomainList(
    miningTitles: MiningTitleWithRelations[],
  ): IMiningTitleResponse[] {
    return miningTitles.map(this.toDomain);
  }
}
