import { SupplierDropdown } from '@shared/types/supplier-dropdown.type';
import { ReceptionOriginDropdown } from '@shared/types/reception-origin-dropdown.type';
import { DoreDropdown } from '@shared/types/dore-dropdopwn.type';

export interface IDoreDropdownData {
  suppliers: SupplierDropdown[];
  dore: DoreDropdown[];
  batchNumbers: string[];
  receptionOrigins: ReceptionOriginDropdown[];
}

export interface IDoreManagementResponse {
  id: string;
  batchNumber: string | null;
  receptionDate: Date;
  observation: string | null;
  dore: Array<{
    id: string;
    code: number;
    receivedWeight: number | any;
    status: {
      id: string;
      name: string;
    };
  }>;
  supplier: {
    id: string;
    name: string;
  };
  receptionOrigin: {
    id: string;
    name: string;
  };
}
