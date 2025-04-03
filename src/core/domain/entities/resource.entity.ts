
export type Resource = {
  readonly id: string,
  readonly name: string,
  readonly icon: string,
  readonly createdAt?: Date,
  readonly updatedAt?: Date,
  readonly createdBy?: string,
  readonly updatedBy?: string,
}