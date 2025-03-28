export class UserPermissionsEntity {
  id!: string;
  name!: string;
  email!: string; // Agregar este campo
  isActive!: boolean;
  companies!: {
    companyId: string;
    companyName: string;
    primaryColor: string;
    secondaryColor: string;
    thirdColor: string;
    logo: string;
    applications: {
      applicationId: string;
      applicationName: string;
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