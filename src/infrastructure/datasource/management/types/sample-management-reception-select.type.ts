import { Prisma } from '@prisma/client';

export type SamplesWithAnalyses = Prisma.ReceptionGetPayload<{
  select: {
    receptionDate: true;
    isActive: true;
    samples: {
      select: {
        id: true;
        code: true;
        receivedWeight: true;
        receptionOrigin: {
          select: {
            name: true;
            shortName: true;
          };
        };
        requiredAnalyses: {
          select: {
            done: true;
            analysisType: {
              select: {
                name: true;
                shortName: true;
              };
            };
          };
        };
        analyses: {
          select: {
            analysisDate: true;
            analysisType: {
              select: {
                name: true;
                shortName: true;
              };
            };
            resultValue: true;
          };
        };
      };
    };
    supplier: {
      select: {
        name: true;
        shortName: true;
      };
    };
  };
}>;
