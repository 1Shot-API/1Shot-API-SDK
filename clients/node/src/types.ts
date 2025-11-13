export interface ClientConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export * from "./categories/contractMethods";
