export interface IActionResponse {
  id: string;
  name: string;
  level: number;
}

export interface ISubresourceResponse {
  id: string;
  name: string;
  icon: string;
  path: string;
  action: IActionResponse;
}

export interface IResourceResponse {
  id: string;
  name: string;
  icon: string;
  path: string;
  subresources: ISubresourceResponse[];
}

export interface IApplicationResponse {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  resources: IResourceResponse[];
}

export interface ICompanyBrandingResponse {
  logo?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  tertiaryColor?: string | null;
}

export interface IPermissionsByCompanyResponse {
  company: {
    id: string;
    name?: string;
    shortName?: string;
    branding: ICompanyBrandingResponse | null;
  };
  applications: IApplicationResponse[];
}
