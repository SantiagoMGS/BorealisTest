export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly logo: string,
    public readonly primaryColor: string,
    public readonly secondaryColor: string,
    public readonly thirdColor: string,
  ) {}
}