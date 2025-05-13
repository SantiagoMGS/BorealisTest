import { ISubresourceEntity } from '@domain/entities/access';

export abstract class PermissionsRepository {
  abstract getAllSubresources(): Promise<ISubresourceEntity[]>;

  abstract hasRoleActionForSubresource(
    roleId: string,
    subresourceId: string,
    actionLevel: number,
  ): Promise<boolean>;
}
