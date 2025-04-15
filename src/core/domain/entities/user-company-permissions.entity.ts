export interface ActionPermission {
  id: string;
  name: string;
  level: number;
}

export interface SubresourcePermission {
  id: string;
  name: string;
  icon: string;
  path: string;
  actions: ActionPermission[];
}

export interface ResourcePermission {
  id: string;
  name: string;
  icon: string;
  path: string;
  subresources: SubresourcePermission[];
}

export interface ApplicationPermission {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  resources: ResourcePermission[];
}

export interface UserCompanyPermissionsEntity {
  applications: ApplicationPermission[];
}
