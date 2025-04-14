import { IReadOnlyRepository } from './read-only.repository';
import { IWriteOnlyRepository } from './write-only.repository';

export interface IRepository<T> extends IReadOnlyRepository<T>, IWriteOnlyRepository<T> { }