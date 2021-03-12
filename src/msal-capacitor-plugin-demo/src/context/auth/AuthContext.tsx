import { useEffect, createContext } from 'react';
import { AuthenticationResult } from '@azure/msal-browser';
import { IAuthContext } from './types';
import { Plugins } from '@capacitor/core';
import { isPlatform } from '@ionic/react';
import '@assimalign/msal-capacitor-plugin';

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: () => { },
  login: () => { },
  logout: () => { },
  acquireUserRoles: () => { },
  acquireAccessTokenForUser: () => { },
  acquireAuthenticationResult: () => { }
})

export const useAuthentication = (): IAuthContext => {
  const { MsalCap, NativeBiometric } = Plugins;
  useEffect(()=> {
    initializeOptions();
  }, []);

  const initializeOptions = async() => {
    let uri = isPlatform('capacitor') ? 'msauth.{iOS MAC redirect Url}://auth' : 'http://localhost:3000';
    console.log(uri);
    (await MsalCap.setOptions({
      clientId: '6b51f8a2-d03d-4d86-b753-87b45b89d794',
      authority: `https://login.microsoftonline.com/29967363-a86a-4ea6-8f76-29aa44ec6f27`,
      redirectUri: uri,
      scopes: [
        'user.read'
      ],
      webOptions: {
        cacheLocation: 'sessionStorage', // Can either be localStorage or sessionStorage or Web App. Default is sessionStorage
        storeAuthStateInCookie: true
      },
      iosOptions: {
        keyShareLocation: 'com.company.cache', // This is the Keyshare location where credentials are stored for silent login
        enableBiometrics: true
      },
      androidOptions: {
        enableBiometrics: true
      }
    }))
  };

  const isAuthenticated = async(): Promise<boolean> => {
    return new Promise(async (resolve, reject)=>{
      try {
        resolve((await MsalCap.isAuthenticated()).results as boolean)
      }
      catch (error) {
        reject(error)
      }
    })
  }

  const login = async(): Promise<AuthenticationResult | null> => {
    return new Promise(async (resolve, reject)=>{
      try {
        let response = (await MsalCap.login()).results;
        if(response) {
            resolve(response as AuthenticationResult);
        }
        resolve(null);
      }
      catch(error){
        reject(error);
      }
    })
  }

  const logout = async(): Promise<void> => {
    return new Promise(async(resolve, reject)=>{
      try {
        (await MsalCap.logout())
        resolve()
      }
      catch(error){
        reject(error)
      }
    })
  }

  const acquireUserRoles = async(): Promise<string[]> => {
    return new Promise(async (resolve, reject)=> {
      try {
        let roles = (await MsalCap.acquireUserRoles()).results;
        if (roles) {
          resolve(roles as string[]);
        } else {
          resolve([]);
        }
      }
      catch(error) {
        reject(error)
      }
    })
  }

  const acquireAccessTokenForUser = async(scopes: string[]): Promise<string> => {
    return new Promise(async (resolve, reject)=>{
      try {
        let token = (await MsalCap.acquireAccessTokenForUser({
          scopes: scopes
        })).results;

        if(token) {
          resolve(token as string);
        } else {
          reject("AuthContext.aquireAccessToken: No Access Token was returned");
        }
      }
      catch(error) {
        console.log(error);
        reject(error)
      }
    })
  }

  const acquireAuthenticationResult = async(): Promise<AuthenticationResult | null> => {
    return new Promise(async (resolve, reject)=>{
      try {
        let results = (await MsalCap.acquireAuthenticationResult()).results;
        if(results) {
          resolve(results as AuthenticationResult);
        }
        resolve(null);
      }
      catch (error) {
        console.log(`Error (Authcontext.AuthenticationResult): ${error}`);
        reject(error);
      }
    })
  }

  return {
    isAuthenticated,
    logout,
    login,
    acquireUserRoles,
    acquireAccessTokenForUser,
    acquireAuthenticationResult
  }
}

export default AuthContext;