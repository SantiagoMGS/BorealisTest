export class UserPermissionsEntity {
  userId!: string; 
  userName!: string;
  userEmail!: string; // Agregar este campo
  isActive!: boolean;
  companies!: {
    companyId: string;
    companyName: string;
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