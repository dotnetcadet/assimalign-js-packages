import { WebPlugin , registerWebPlugin} from '@capacitor/core';
import { IMsalPlugin, IMsalPluginOptions } from './definitions';
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';

export class MsalPluginWeb extends WebPlugin implements IMsalPlugin {
  msalResults: AuthenticationResult | null;
  msalAuthenticated: boolean;
  msalClient?: PublicClientApplication;
  msalPopupScopes: string[];
  msalHasOptions: boolean;
  
  constructor() {
    super({
      name: 'MsalCap',
      platforms: ['web'],
    });

    this.msalResults = null;
    this.msalAuthenticated = false;
    this.msalPopupScopes = [];
    this.msalHasOptions = false;
  }

  async setOptions(options?: IMsalPluginOptions): Promise<void> {
    return new Promise((resolve, reject)=> {
      try {
        if(options) {
          this.msalClient = new PublicClientApplication({
            auth: {
              clientId: options.clientId,
              redirectUri: options.redirectUri,
              authority: options.authority
            },
            cache: {
              cacheLocation: options?.webOptions?.cacheLocation ?? "localStorage",
              storeAuthStateInCookie: options?.webOptions?.storeAuthStateInCookie ?? true
            }
          })
          this.msalPopupScopes = options.scopes;
          this.msalHasOptions = true;
          resolve();
        } else {
          reject("No Options where passed through");
        }
      }
      catch (error) {
        reject(error)
      }
    })
  }

  async isAuthenticated(): Promise<{results: boolean}> {
    return new Promise(async (resolve, reject)=>{
      try {
        resolve({results: this.msalAuthenticated})
      }
      catch(error){
        reject(error)
      }
    })
  }

  async login(): Promise<{results: AuthenticationResult | null}> {
    return new Promise(async (resolve, reject)=>{
      try {
        if(!this.msalHasOptions){
          reject("Options have not been set");
        }

        if(this.msalClient) {
          let response = await this.msalClient.loginPopup({
            scopes: this.msalPopupScopes,
            prompt: 'select_account'
          })
    
          if(response) {
            this.msalAuthenticated = true;
            this.msalResults = response;
            resolve({
              results: response
            })
          }
        }
        resolve({
          results: null
        });
      }
      catch(error){
        reject(error);
      }
    })
  }

  async logout(): Promise<void> {
    return new Promise(async (resolve, reject)=>{
      if(this.msalClient){
        await this.msalClient.logout({
          account: this.msalClient.getActiveAccount() ?? undefined
        });
        this.msalAuthenticated = false;
        resolve()
      }
      reject()
    })
  }

  async acquireUserRoles(): Promise<{results: string[]}> { 
    return new Promise((resolve, reject)=> {
      try {
        let roles = (this.msalResults?.idTokenClaims as any)?.roles as string[] ?? [];
        if(roles){
          resolve({
            results: roles
          });
        }
        resolve({
          results: []
        });
      }
      catch(error) {
        reject(error);
      }
    })
  }

  async acquireAuthenticationResult(): Promise<{results: AuthenticationResult | null}> {
    return new Promise((resolve, reject)=> {
      if(this.msalResults){
        resolve({
          results: this.msalResults
        })
      } else {
        reject("No Authentication Results to return")
      }
    })
  }

  async acquireAccessTokenForUser(request: {scopes: string[]}): Promise<{results: string}> {
    return new Promise(async (resolve, reject)=>{
      if(this.msalClient){
        try {
          let token = await this.msalClient.acquireTokenSilent({
            scopes: request.scopes,
            account: this.msalResults?.account ?? undefined
          });
          resolve({
            results: token.accessToken
          })
        }
        catch(error){
          reject(error);
        }
      }
      reject("MSAL Client has not been initiated");
    })
  }
}

const MsalPlugin = new MsalPluginWeb();

export { MsalPlugin };
registerWebPlugin(MsalPlugin);
