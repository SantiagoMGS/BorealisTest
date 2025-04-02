import { CompanyBranding } from "./company-brand.entity";

export type Company = {
  id?: string;
  name: string;
  shortName: string;
  code?: string | null;
  isActive?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  isDeleted?: boolean;
  branding?: CompanyBranding | null;
}