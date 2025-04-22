export interface TokenPayload {
  sub: string;
  [key: string]: any; // Para propiedades adicionales que puedan ser necesarias
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface ITokenPort {
  generateTokens(payload: TokenPayload): TokenResponse;
  verifyToken(token: string): TokenPayload;
}
