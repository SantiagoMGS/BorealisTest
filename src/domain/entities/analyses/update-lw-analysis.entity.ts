import { InputJsonObject } from '@prisma/client/runtime/library';

export interface UpdateLWAnalysis extends InputJsonObject {
  id: string;
  realEndDateTime?: Date;
  done: boolean;
}
