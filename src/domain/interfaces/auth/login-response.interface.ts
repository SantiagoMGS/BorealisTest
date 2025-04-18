export interface ICompanyBranding {
  logo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  tertiaryColor: string | null;
}

export interface ICompanyResponse {
  id: string;
  name: string;
  shortName: string;
  role: string;
  branding: ICompanyBranding | null;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface ILoginResponse {
  id: string;
  companies: ICompanyResponse[];
  tokens: ITokens;
}
