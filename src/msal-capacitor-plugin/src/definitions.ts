import { AuthenticationResult } from '@azure/msal-browser';

declare module '@capacitor/core' {
  interface PluginRegistry {
    MsalPlugin: IMsalPlugin;
  }
}

export interface IMsalPluginOptions {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  authority: string;
}

export interface IMsalPlugin {
  setOptions(options?: IMsalPluginOptions): Promise<void>;
  isAuthenticated(): Promise<{results: boolean}>;
  login(): Promise<{results: AuthenticationResult | null}>;
  logout(): Promise<void>;
  acquireUserRoles(): Promise<{results: string[]}>;
  acquireAuthenticationResult(): Promise<{results: AuthenticationResult | null}>;
  acquireAccessTokenForUser(request?: {scopes: string[]}): Promise<{results: string}>;
}