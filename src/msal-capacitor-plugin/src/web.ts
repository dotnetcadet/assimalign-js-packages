import { WebPlugin } from '@capacitor/core';
import { IMsalPlugin, IMsalPluginOptions } from './definitions';
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';

export class MsalPluginWeb extends WebPlugin implements IMsalPlugin {
  authResults: AuthenticationResult | null;
  authenticated: boolean;
  client?: PublicClientApplication;
  popupScopes: string[];
  hasOptions: boolean;
  
  constructor() {
    super({
      name: 'MsalCap',
      platforms: ['web'],
    });

    this.authResults = null;
    this.authenticated = false;
    this.popupScopes = [];
    this.hasOptions = false;
    console.log('Plugin Instantiated');
  }



  async setOptions(options?: IMsalPluginOptions): Promise<void> {
    return new Promise((resolve, reject)=> {
      try {
        if(options) {
          this.client = new PublicClientApplication({
            auth: {
              clientId: options.clientId ,
              redirectUri: options.redirectUri,
              authority: options.authority
            },
            cache: {
              cacheLocation: "localStorage",
              storeAuthStateInCookie: true
            }
          })
          this.popupScopes = options.scopes;
          this.hasOptions = true;
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
        resolve({results: this.authenticated})
      }
      catch(error){
        reject(error)
      }
    })
  }

  async login(): Promise<{results: AuthenticationResult | null}> {
    return new Promise(async (resolve, reject)=>{
      try {
        if(!this.hasOptions){
          reject("Options have not been set");
        }

        if(this.client) {
          let response = await this.client.loginPopup({
            scopes: this.popupScopes,
            prompt: 'select_account'
          })
    
          if(response) {
            this.authenticated = true;
            this.authResults = response;
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
      if(this.client){
        await this.client.logout({
          account: this.client.getActiveAccount() ?? undefined
        });
        this.authenticated = false;
        resolve()
      }
      reject()
    })
  }

  async acquireUserRoles(): Promise<{results: string[]}> { 
    return new Promise((resolve, reject)=> {
      try {
        let roles = (this.authResults?.idTokenClaims as any)?.roles as string[] ?? [];
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
      if(this.authResults){
        resolve({
          results: this.authResults
        })
      } else {
        reject("No Authentication Results to return")
      }
    })
  }

  async acquireAccessTokenForUser(request: {scopes: string[]}): Promise<{results: string}> {
    return new Promise(async (resolve, reject)=>{
      if(this.client){
        try {
          let token = await this.client.acquireTokenSilent({
            scopes: request.scopes,
            account: this.authResults?.account ?? undefined
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

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(MsalPlugin);
