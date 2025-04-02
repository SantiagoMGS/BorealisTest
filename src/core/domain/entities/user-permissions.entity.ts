export class UserPermissionsEntity {
  id!: string;
  name!: string;
  email!: string;
  isActive!: boolean;
  companies!: {
    companyId: string;
    companyName: string;
    code?: string;
    isActive: boolean;
    branding?: {
      logo?: string;
      primaryColor?: string;
      secondaryColor?: string;
      tertiaryColor?: string;
    };
    applications: {
      applicationId: string;
      applicationName: string;
      code?: string;
      isActive: boolean;
      permissions: {
        actionId: string;
        actionName: string;
        actionLevel: number;
        subresourceId: string;
        subresourceName: string;
        resourceId: string;
        resourceName: string;
      }[];
    }[];
    roleId: string;
    roleName: string;
  }[];
}
