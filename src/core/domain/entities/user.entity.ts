export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public isActive: boolean,
    public refreshToken: string | null = null,
    public refreshTokenExpired: Date | null = null,
  ) {}
}