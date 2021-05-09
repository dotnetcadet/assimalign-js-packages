import { 
  WebPlugin , 
  registerWebPlugin } from '@capacitor/core';
import { 
  MsalEndSessionRequest, 
  MsalAccountInfo, 
  MsalAuthenticationResults, 
  MsalInteractiveRequest, 
  IMsalPlugin, 
  MsalConfigurations, 
  MsalSilentRequest,
  MsalError,
  MsalErrorCollection } from './definitions';

import { 
  PublicClientApplication,
  AuthError } from '@azure/msal-browser';

import  '@azure/msal-browser'

export class MsalPluginWeb extends WebPlugin implements IMsalPlugin {
  
  client?: PublicClientApplication;
  hasOptions: boolean;
  optionsMissingError: MsalError;

  
  constructor() {
    super({
      name: 'MsalPlugin',
      platforms: ['web'],
    });

    this.client = undefined
    this.hasOptions = false;
    this.optionsMissingError = {
      errorCode: "options_missing",
      errorMessage: "Please ensure plugin has been initialized and options have been set before making any requests",
      errorDetails: "Error was thrown due to missing options wihtin plugin"
    }
  }


  async initialize(options?: MsalConfigurations ): Promise<{results: boolean}> {
    return new Promise((resolve, reject)=> {
      try {
        if (options) {
          if (options.guardForRerenders === true  &&  this.hasOptions === true) {
            resolve({
              results: true
            })
            return
          }
          this.client = new PublicClientApplication({
            auth: options,
            cache: options,
            system: options
          });
          this.hasOptions = true;

          resolve({
            results: true
          })

        } else {
          reject(MsalErrorCollection['invalid_options_set']);
        }
      }
      catch (error) {
        reject(this.getMsalError(error))
      }
    })
  }

  // If runing in web then biometrics by default is false
  async isBiometricsAvailable(): Promise<{results: boolean}> {
    return new Promise((resolve)=>{
      resolve({
        results: false
      })
    })
  }

  async canEvaluateBiometricsPolicy(): Promise<{results: boolean}> {
    return new Promise((resolve)=>{
      resolve({
        results: false
      })
    }) 
  }

  async evaluateBiometricsPolicy(): Promise<{results: boolean}> {
    return new Promise((resolve)=>{
      resolve({
        results: false
      })
    })
  }

  async acquireTokenSilently(request: MsalSilentRequest): Promise<{ results: MsalAuthenticationResults }> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasOptions) {
        reject(this.optionsMissingError)
      }
    
      try {
        let silentResponse = await this.client?.acquireTokenSilent(request)
        if(silentResponse) {
          resolve({
            results: silentResponse
          })
        }
      }
      catch(error) {
        reject(this.getMsalError(error))
      }
    })
  }

  async acquireTokenInteractively(request: MsalInteractiveRequest): Promise<{ results: MsalAuthenticationResults }> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasOptions) {
        reject(this.optionsMissingError)
      }
      try {
        let interactiveResponse = await this.client?.acquireTokenPopup(request)
        if (interactiveResponse) {
          resolve({
            results: interactiveResponse
          })
        } else {
          reject()
        }
      }
      catch(error) {
        reject(this.getMsalError(error))
      }
    })
  }

  async acquireAllAccounts(): Promise<{results: MsalAccountInfo[] | undefined}> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasOptions) {
        reject(this.optionsMissingError)
      }
      try {
        let accounts = await this.client?.getAllAccounts()
        resolve({
          results: accounts
        })
      }
      catch(error) {
        reject(this.getMsalError(error))
      }
    })
  }

  async acquireCurrentAccount(): Promise<{ results: MsalAccountInfo | null | undefined }> {
    return new Promise(async (resolve, reject)=> {
      if (!this.hasOptions) {
        reject(this.optionsMissingError)
      }
      try {
        let account = await this.client?.getActiveAccount();
        resolve({
          results: account
        })
      }
      catch(error) {
        reject(this.getMsalError(error))
      }
    })
  }

  async acquireAccountByUsername(params: {username: string }): Promise<{results: MsalAccountInfo | undefined}> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasOptions) {
        reject(this.optionsMissingError)
      }
      try {
        let account = await this.client?.getAccountByUsername(params.username)
        if(account) {
          resolve({
            results: account
          })
        }
      }
      catch(error) {
        reject(this.getMsalError(error))
      }
    })
  }

  async login(request: MsalInteractiveRequest): Promise<{ results: MsalAuthenticationResults }> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasOptions) {
        reject(this.optionsMissingError)
      }
      try {
        let interactiveResponse = await this.client?.loginPopup(request)
        if (interactiveResponse) {
          resolve({
            results: interactiveResponse
          })
        } else {
          reject(new AuthError("An unknown error has occured within Msal CAP Web Implementation"))
        }
      }
      catch(error) {
        reject(this.getMsalError(error))
      }
    })
  }

  async logout(request: MsalEndSessionRequest): Promise<{results: boolean}> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasOptions) {
        reject(this.optionsMissingError)
      }
      try {
        if (request.postLogoutRedirectUri) {
          await this.client?.logoutRedirect(request) // This option will do a redirect after login
        } else {
          await this.client?.logoutPopup(request);
        }
        resolve({
          results: true
        })
      }
      catch(error) {
        reject(this.getMsalError(error))
      }
    })
  }

  private getMsalError(error?: any): MsalError {
    try {

      var msalError = new MsalError()

      // Check for error code
      if (error?.errorCode) {
        msalError = MsalErrorCollection[error.errorCode] 
      }
      // Check for Error Stack Property First
      if (error?.stack) {
        msalError.stack = error.stack
      }
      // Check for error Message
      if(error?.message) {
        msalError.errorDetails = error.message 
      }

      if (msalError) {
        return msalError
      } else {
        return  {
          errorCode: 'unknown_error',
          errorType: error?.name,
          errorMessage: error?.message,
          stack: error?.stack as string
        }
      }
    }
    catch(error) {
      return error
    }
  }
}

const MsalPlugin = new MsalPluginWeb();

export { MsalPlugin };
registerWebPlugin(MsalPlugin);
