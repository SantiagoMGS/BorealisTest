import { Prisma } from '@prisma/client';

export type AnalysisTypeSelect = Prisma.AnalysisTypeGetPayload<{
  select: {
    id: true;
    name: true;
    shortName: true;
  };
}>;
