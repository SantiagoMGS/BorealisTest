import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const SUBRESOURCE_KEY = 'subresource';

export const Permissions = (...permissions: { resource: string; action: string }[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const RequireSubresource = (subresource: string) =>
  SetMetadata(SUBRESOURCE_KEY, subresource);
