import { AuthenticationResult } from '@azure/msal-browser';

declare module '@capacitor/core' {
  interface PluginRegistry {
    MsalPlugin: IMsalPlugin;
  }
}

export interface IMsalAndroidPluginOptions {
  enableBiometrics?: boolean;
}

export interface IMsalWebPluginOptions {
  cacheLocation?: 'sessionStorage' | 'localStorage';
  storeAuthStateInCookie?: boolean;
}

export interface IMsalIosPluginOptions {
  keyShareLocation?: string;
  enableBiometrics?: boolean;
}

export interface IMsalPluginOptions {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  authority: string;
  webOptions?: IMsalWebPluginOptions;
  iosOptions?: IMsalIosPluginOptions;
  androidOptions?: IMsalAndroidPluginOptions;
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