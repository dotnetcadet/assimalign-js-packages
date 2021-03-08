# Capacitor Plugin to Sign into Microsoft Identity
- [Maintainers](#maintainers)
- [Installation](#installation)
- [Usage](#usage)
  - [Initial Setup](#initial-setup) 

---
Capacitor plugin to support [Sign in with Microsoft Identity (Personal & Work Account, Azure)](https://login.microsoftonline.com/common/)


## Maintainers
| Maintainer             | GitHub                                      | Sponsoring Company |                        |
| ---------------------- | ------------------------------------------- | -------------------|------------------------| 
| Chase Crawford         | [chasec2018](https://github.com/chasec2018) | Assimalign LLC     |                        |

Maintenance Status: Partially Maintained (help wanted)

## Installation
- `npm i @assimalign/msal-capacitor-plugin`

---

## Usage (Web iOS)) [Android Comming soon]
Below are examples are of how to implement an authentication provider that can be resued through out the application.

### Initial Setup
- Step 1 : `npm install -g @ionic/cli`
- Step 2 : `ionic start {app name} --type {app type}` Type: react | angular | vue
- Step 3 : `ionic serve` (Need to build applicaiton before implementing plugin)
- Step 4 : `npm i @assimalign/msal-capacitor-plugin`
- Step 5 : `ionic cap sync` Downlaoad Package
  
---

## React App Instruction (Typescript)
Using `useContext` hook we will implement an auth provider that will wrap our application. **NOTE: As long as the**
### 1. IAuthContext Interface
- Under `src` create a folder called `authentication`
- Under `authentication` create a `IAuthContext.ts` file
- Implement `IAuthContext` Interface
  
  ```ts
    export interface IAuthContext {
      isAuthenticated: Function;
      login: Function;
      logout: Function;
      acquireUserRoles: Function;
      acquireAccessTokenForUser: Function;
      acquireAuthenticationResult: Function;
    }
  ```

### 2. Create Context
- Under `authentication` create a folder called `authentication`
- Under `authentication` create a `IAuthContext.ts` file
- Implement `IAuthContext` Interface
  
  ```ts
  import { useEffect, createContext } from 'react';
  import { AuthenticationResult } from '@azure/msal-browser';
  import { IAuthContext } from './types';
  import { Plugins } from '@capacitor/core';
  import { isPlatform } from '@ionic/react';
  import { AvailableResult, BiometryType } from 'capacitor-native-biometric';
  import '@eastdil/msal-capacitor-plugin';

  const AuthContext = createContext<IAuthContext>({
    isAuthenticated: () => { },
    login: () => { },
    logout: () => { },
    acquireUserRoles: () => { },
    acquireAccessTokenForUser: () => { },
    acquireAuthenticationResult: () => { }
  })

  export const useAuth = (): IAuthContext => {
    const { MsalCap, NativeBiometric } = Plugins;
    useEffect(()=> {
      initializeOptions();
    }, []);

    const initializeOptions = async() => {
      let uri = isPlatform('capacitor') ? 'msauth.com.eastdilsecured.portal://auth' : 'http://localhost:3000';
      console.log(uri);
      (await MsalCap.setOptions({
        clientId: process.env.REACT_APP_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
        redirectUri: uri,
        scopes: [
          'user.read'
        ]
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
          if (await biometricAuth() === true) {
            let response = (await MsalCap.login()).results;
            if(response) {
              resolve(response as AuthenticationResult);
            }
            resolve(null);
          } else {
            reject("Unable to Authenticate");
          }
        }
        catch(error){
          reject(error);
        }
      })
    }


    const biometricAuth = async(): Promise<boolean> => {
      return new Promise(async (resolve, reject)=>{
        if(isPlatform('capacitor')) {
          NativeBiometric.isAvailable().then(
            (result: AvailableResult) => {
              const isAvailable = result.isAvailable;
              const isFaceId = result.biometryType == BiometryType.FACE_ID;
              if (isAvailable) {
                NativeBiometric.verifyIdentity({
                  reason: "For easy log in",
                  title: "Log in",
                  subtitle: "Maybe add subtitle here?",
                  description: "Maybe a description too?"
                }).then(()=>{
                  resolve(true);
                }, (error: any)=> {
                  resolve(false);
                })
              } else {
                // Return true even
                resolve(true); 
              }
            }
          );
        } else {
          resolve(true);
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
  ```

---


## Vue.js App Instruction (Typescript)
Example Coming Soon

---

## Angular App Instruction (Typescript)
Example Coming Soon

---

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://rdlabo.jp">
      <img src="https://avatars.githubusercontent.com/u/46410573?s=60&amp;v=4" width="100px"><br /><sub><b>Chase Crawford</b></sub></a><br />
      <a href="https://github.com/capacitor-community/apple-sign-in/commits?author=rdlabo" title="Code">💻</a>
      </td>
  </tr>
</table>