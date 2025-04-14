export interface IReadOnlyRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(page?: number, limit?: number): Promise<{ data: T[]; total: number }>;
}
