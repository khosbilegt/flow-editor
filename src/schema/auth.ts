interface AuthConfig {
  clientId: string;
  redirectUri: string;
  clientSecret: string;
  serverUrl: string;
  loginPath: string;
  logoutPath: string;
  tokenRefreshPath: string;
  scopes: string[];
  responseType: string;
  tenantId: string;
  logoutAPIUrl: string;
}

export type { AuthConfig };
