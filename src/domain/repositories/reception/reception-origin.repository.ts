import { ReceptionOrigin } from '@prisma/client';

export abstract class ReceptionOriginRepository {
  abstract findById(id: string): Promise<ReceptionOrigin>;

  abstract getDefaultAnalysisByOriginId(
    originId: string,
  ): Promise<Array<{ id: string; name: string; shortName: string }>>;

  abstract getSuppliersByOriginId(
    originId: string,
  ): Promise<Array<{ id: string; name: string }>>;
}
