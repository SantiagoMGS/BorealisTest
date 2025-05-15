import { ReceptionOriginDropdown } from '@shared/types/reception-origin-dropdown.type';
import { SampleDropdown } from '@shared/types/sample-dropdown.type';
import { SupplierDropdown } from '@shared/types/supplier-dropdown.type';

export interface ISampleDropdownData {
  suppliers: SupplierDropdown[];
  samples: SampleDropdown[];
  receptionOrigins: ReceptionOriginDropdown[];
}
