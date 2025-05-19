import { Prisma } from '@prisma/client';

export type SampleDetailSelect = {
  id: string;
  companyId: string;
  supplierId: string;
  receptionDate: Date;
  batchNumber: string | null;
  observation: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  receptionOriginId: string;
  receptionTypeId: string;
  miningTitleId: string | null;
  cityId: string | null;
  supplier: {
    id: string;
    name: string;
    shortName: string;
  };
  samples: Array<{
    id: string;
    receptionId: string;
    receptionOriginId: string;
    receivedWeight: Prisma.Decimal;
    code: string;
    statusId: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    updatedBy: string | null;
    receptionOrigin: {
      id: string;
      name: string;
      shortName: string;
    };
    status: {
      id: string;
      name: string;
    };
    requiredAnalyses: Array<{
      id: string;
      sampleId: string;
      analysisTypeId: string;
      done: boolean;
      analysisType: {
        id: string;
        name: string;
        shortName: string;
      };
    }>;
    analyses: Array<{
      id: string;
      analysisTypeId: string;
      sampleId: string;
      resultValue: any;
      analysisDate: Date;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      analysisType: {
        id: string;
        name: string;
        shortName: string;
      };
    }>;
    subSamples: Array<{
      id: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      createdBy: string | null;
      updatedBy: string | null;
      SampleId: string;
      weight: Prisma.Decimal;
      subSampleTypeId: string;
    }>;
  }>;
};
