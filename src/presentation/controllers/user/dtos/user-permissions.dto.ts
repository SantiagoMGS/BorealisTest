export class UserPermissionsResponseDto {
  userId: string;
  userName: string;
  email: string;
  isActive: boolean;
  companyId: string;
  companyName: string;
  applicationId?: string;
  applicationName?: string;
  applicationIsActive?: boolean;
  roleId: string;
  roleName: string;
  resourceId: string;
  resourceName: string;
  subresourceId: string;
  subresourceName: string;
  actionId: string;
  actionName: string;
  actionLevel: number;
}