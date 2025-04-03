import { CompanyBranding } from "./company-brand.entity";

export type Company = {
  id?: string;
  name: string;
  shortName: string;
  isActive?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  branding?: CompanyBranding | null;
}