import { AuthenticationResult } from '@azure/msal-browser';

declare module '@capacitor/core' {
  interface PluginRegistry {
    MsalPlugin: IMsalPlugin;
  }
}

export interface IMsalAndroidPluginOptions {
  enableBiometrics?: boolean;
}

/**
 * Use this to configure the below cache configuration options:
 *
 * - cacheLocation            - Used to specify the cacheLocation user wants to set. Valid values are "localStorage" and "sessionStorage"
 * - storeAuthStateInCookie   - If set, MSAL stores the auth request state required for validation of the auth flows in the browser cookies. By default this flag is set to false.
 * - secureCookies            - If set, MSAL sets the "Secure" flag on cookies so they can only be sent over HTTPS. By default this flag is set to false.
 */
export interface IMsalWebPluginOptions {
  cacheLocation?: 'sessionStorage' | 'localStorage' | 'memoryStorage';
  storeAuthStateInCookie?: boolean;
  secureCookies?: boolean;
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
  knownAuthorities?: Array<string>;
  webOptions?: IMsalWebPluginOptions;
  iosOptions?: IMsalIosPluginOptions;
  androidOptions?: IMsalAndroidPluginOptions;
  rerenderGuard?: boolean;
}

export interface IMsalPlugin {
  setOptions(options?: IMsalPluginOptions): Promise<void>;
  isAuthenticated(): Promise<{results: boolean}>;
  login(): Promise<{results: AuthenticationResult | null}>;
  logout(): Promise<void>;
  acquireUserRoles(): Promise<{results: string[]}>;
  acquireAuthenticationResult(): Promise<{results: AuthenticationResult | null}>;
  acquireAccessTokenForUser(request?: {scopes: string[], forceRefresh?:boolean}): Promise<{results: string}>;
}