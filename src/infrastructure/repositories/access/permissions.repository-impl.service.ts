import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from '@domain/repositories/access/permissions.repository';
import { PermissionsDataSource } from '@infrastructure/datasource/access/permissions.datasource.service';
import { ISubresourceEntity } from '@domain/entities/access';

@Injectable()
export class PermissionsRepositoryImpl implements PermissionsRepository {
  constructor(private readonly permissionsDataSource: PermissionsDataSource) {}

  async getAllSubresources(): Promise<ISubresourceEntity[]> {
    return this.permissionsDataSource.getAllSubresources();
  }

  async hasRoleActionForSubresource(
    roleId: string,
    subresourceId: string,
    actionLevel: number,
  ): Promise<boolean> {
    return this.permissionsDataSource.hasRoleActionForSubresource(
      roleId,
      subresourceId,
      actionLevel,
    );
  }
}
