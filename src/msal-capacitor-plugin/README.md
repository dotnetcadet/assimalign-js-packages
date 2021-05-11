# Capacitor Plugin to Sign into Microsoft Identity
- [Capacitor Plugin to Sign into Microsoft Identity](#capacitor-plugin-to-sign-into-microsoft-identity)
  - [Maintainers](#maintainers)
  - [v2.0.0 Breaking Changes](#v200-breaking-changes)
  - [Installation](#installation)
  - [Usage (Web, iOS) [Android Coming soon]](#usage-web-ios-android-coming-soon)
    - [Initial Setup](#initial-setup)
    - [iOS Specific Setup: Add keys to info.plist File](#ios-specific-setup-add-keys-to-infoplist-file)
  - [Vue.js Instructions (Typescript)](#vuejs-instructions-typescript)
    - [1. Create Store](#1-create-store)
  - [React.js Instruction (Typescript)](#reactjs-instruction-typescript)
    - [1. Create Store](#1-create-store-1)
    - [2. Create an Authentication Session Hook](#2-create-an-authentication-session-hook)
    - [3. Add Authentication Session Hook tp app](#3-add-authentication-session-hook-tp-app)
    - [4. Update AppDelegate.swift file in App Folder of ios platform](#4-update-appdelegateswift-file-in-app-folder-of-ios-platform)
  - [MSAL Capacitor Plugin Methods & Types](#msal-capacitor-plugin-methods--types)
    - [Methods](#methods)
    - [Types](#types)
  - [Contributors](#contributors)

---
Capacitor plugin to support [Sign in with Microsoft Identity (Personal & Work Account, Azure)](https://login.microsoftonline.com/common/)


## Maintainers
| Maintainer             | GitHub                                      | Sponsoring Company |                        |
| ---------------------- | ------------------------------------------- | -------------------|------------------------| 
| Chase Crawford         | [chasec2018](https://github.com/chasec2018) | Assimalign LLC     |                        |

---

## v2.0.0 Breaking Changes
- API Changes: All original APIs from v1 will be removed besides login(), and logout(). However, the parameters have changed.
- Cross-Platform Return Types: return types should be the same as 



---


## Installation
- `npm i @assimalign/msal-capacitor-plugin`

---

## Usage (Web, iOS) [Android Coming soon]
Below are examples are of how to implement an authentication provider that can be reused through out the application.

### Initial Setup
- Step 1 : `npm install -g @ionic/cli`
- Step 2 : `ionic start {app name} --type {app type}` Type: react | angular | vue
- Step 3 : `ionic serve` (Need to build application before implementing plugin)
- Step 4 : `npm i @assimalign/msal-capacitor-plugin`
- Step 5 : `ionic cap sync` Download Package
  

### iOS Specific Setup: Add keys to info.plist File
```xml
  <key>LSApplicationQueriesSchemes</key>
  <array>
    <string>msauthv2</string>
    <string>msauthv3</string>
  </array>
  <key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleURLName</key>
			<string>com.getcapacitor.capacitor</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>capacitor</string>
				<string><!--The Bundle Id Redirect Url--></string>
			</array>
		</dict>
	</array>
  <!-- If use Biometric Auth-->
  <key>NSFaceIDUsageDescription</key>
  <string>For an easier and faster log in.</string>
```
---

## Vue.js Instructions (Typescript)
To implementation authentication were going to create authentication session hooks that update global state through-out our application.

### 1. Create Store
Under `src` folder create a `store.ts` file if not already there and add the below code.


---

## React.js Instruction (Typescript)
To implementation authentication were going to create authentication session hooks that update global state through-out our application.

### 1. Create Store
Under `src` folder create a `store.ts` file if not already there and add the below code.

```ts
import { createStore, combineReducers } from 'redux'
import { 
  MsalAccountInfo, 
  MsalAuthenticationResults, 
  MsalError } from '@assimalign/msal-capacitor-plugin'


interface ISecurityResults {
  isAuthenticated: boolean;
  authenticationResults?: MsalAuthenticationResults;
  authenticationAccount?: MsalAccountInfo;
  authenticationRoles: Array<string> // This is useful if utilizing RBAC with Application Registrations within Azure AD 
  authenticationError?: MsalError;
}

interface ISecurityAction {
  type: 'SET_AUTHENTICATION_STATUS' | 'SET_AUTHENTICATION_RESULTS' | 'SET_AUTHENTICATION_ERROR' | 'SET_AUTHENTICATION_ACCOUNT' | 'SET_AUTHENTICATION_ROLES' | 'REMOVE_AUTHENTICATION_RESULTS'| 'REMOVE_AUTHENTICATION_ACCOUNT'
  payload: any
}

// Dispatch Functions for State Mutations
export const SetAuthenticationStatus = (payload: boolean): ISecurityAction => ({
  type: 'SET_AUTHENTICATION_STATUS',
  payload
})

export const SetAuthenticationResults = (payload: MsalAuthenticationResults): ISecurityAction => ({
  type: 'SET_AUTHENTICATION_RESULTS',
  payload
})

export const RemoveAuthenticationResults = (): ISecurityAction => ({
  type: 'REMOVE_AUTHENTICATION_RESULTS',
  payload: undefined
})

export const SetAuthenticationError = (payload: MsalError): ISecurityAction => ({
  type: 'SET_AUTHENTICATION_ERROR',
  payload
})

export const SetAuthenticationAccount = (payload: MsalAccountInfo): ISecurityAction =>({
  type: 'SET_AUTHENTICATION_ACCOUNT',
  payload
})

export const RemoveAuthenticationAccount = (): ISecurityAction => ({
  type: 'REMOVE_AUTHENTICATION_ACCOUNT',
  payload: undefined
})

export const SetAuthenticationRoles = (payload: Array<string>): ISecurityAction =>({
  type: 'SET_AUTHENTICATION_ROLES',
  payload
})


// Let's set default state
const securityResults: ISecurityResults = {
  isAuthenticated: false,
  authenticationResults: undefined,
  authenticationAccount: {
    environment: '',
    homeAccountId: '',
    name: '',
    localAccountId: '',
    tenantId: '',
    username: ''
  },
  authenticationRoles: [],
  authenticationError: undefined
}

const SecurityInfoReducer = (state: ISecurityResults = securityResults, action: any) => {
  switch(action.type) {
    case 'SET_AUTHENTICATION_STATUS': 
      state.isAuthenticated = action.payload
      return state
    
    case 'SET_AUTHENTICATION_RESULTS':
      state.authenticationResults = action.payload
      return state

    case 'REMOVE_AUTHENTICATION_RESULTS':
      state.authenticationResults = undefined
      return state

    case 'SET_AUTHENTICATION_ACCOUNT': 
      state.authenticationAccount = action.payload
      return state

    case 'REMOVE_AUTHENTICATION_ACCOUNT': 
      state.authenticationAccount = undefined
      return state

    case 'SET_AUTHENTICATION_ERROR': 
      state.authenticationError = action.payload
      return state

    case 'SET_AUTHENTICATION_ROLES': 
      state.authenticationRoles = action.payload
      return state
    
    default: 
      return state
  }
}

const reducers = combineReducers({
  SecurityInfoReducer
}) 

export type RootState = ReturnType<typeof reducers>;

const Store = createStore(reducers)

export default Store
  ```

### 2. Create an Authentication Session Hook
Under `src` folder create a folder called `auth` and create a `AuthenticationSession.ts` file.

```ts
import { isPlatform } from '@ionic/react'
import Store, { 
  SetAuthenticationAccount, 
  SetAuthenticationResults, 
  SetAuthenticationRoles, 
  SetAuthenticationStatus, 
  RemoveAuthenticationAccount,
  RemoveAuthenticationResults } from '../store'
import {
  MsalAuthenticationResults,
  MsalConfigurations,
  MsalError,
  MsalInteractiveRequest,
} from '@assimalign/msal-capacitor-plugin'
import { Plugins } from '@capacitor/core'


export const redirectUri = (): string => {
  if (isPlatform('capacitor')) {
    return 'msauth.{Your iOS return url}://auth'
  } else {
    return  'http://localhost:3000'
  }
}

export const initializationOptions: MsalConfigurations = {
  authority: 'https://login.microsoftonline.com/{tenant id}',
  clientId: 'Your Application Client ID',
  redirectUri: redirectUri(),
  cacheLocation: "localStorage",
  storeAuthStateInCookie: true,
  tokenExpirationBuffer: 10,
  extendedLifetimeEnabled: true,
  keychainSharingGroup: `com.microsoft.adalcache`,
  guardForRerenders: true
}

export const loginInteractiveRequest: MsalInteractiveRequest = {
  authority: 'https://login.microsoftonline.com/{tenant id}',
  redirectUri: redirectUri(),
  scopes: [
    'user.read'
  ],
  extraScopesToConsent: [
   'usually scopes for downstream apis'
  ],
  prompt: isPlatform('capacitor') ? 'promptIfNecessary' : 'none',
  promptView: 'wkWebView'
}


export const startAuthenticatedSession = async () => {

  const MsalPlugin = Plugins.MsalPlugin
  const state = Store.getState()
  const isAuthenticated = state.SecurityInfoReducer.isAuthenticated

  if (isAuthenticated) {
    return 
  }

  let results: MsalAuthenticationResults | undefined
  let interactiveRequest: MsalInteractiveRequest = loginInteractiveRequest
  let interactionNeeded = false

  if ((await MsalPlugin.initialize(initializationOptions)).results) {

    let biometricsAvailable = (await MsalPlugin.isBiometricsAvailable()).results
    let biometricsCanEvaluate = (await MsalPlugin.canEvaluateBiometricsPolicy()).results
    let biometricsStatus = false

    // 1. Let's check if there are any account on the device
    const accounts = (await MsalPlugin.acquireAllAccounts()).results
    // if multiple accounts are found we need to change prompt type
    if (accounts !== undefined && accounts.length > 1) {
      interactiveRequest.prompt = 'select_account'
    } else if (accounts) {
      interactiveRequest.account = accounts[0]
    } else {
      interactiveRequest.prompt = 'login'
    }

    // 2. Let's evaluate whether Biometrics is available and if we can use it on the device
    if (biometricsAvailable && biometricsCanEvaluate ) {
      biometricsStatus = (await MsalPlugin.evaluateBiometricsPolicy()).results
    }

    if (biometricsAvailable && biometricsCanEvaluate && !biometricsStatus && isPlatform('capacitor') && (accounts?.length ?? 0) === 1) {
      interactiveRequest.prompt = 'login'
    }
    
    try {
      results = (await MsalPlugin.login(interactiveRequest)).results
    } 
    catch(error) {
      // Let's check to see if we've received an interactive_login error
      if ((error as MsalError)?.errorCode === 'interaction_required') {
        interactiveRequest.prompt = 'login'
        interactionNeeded = true
      } else {
        throw error
      }
    }

    if (interactionNeeded) {
      results = (await MsalPlugin.acquireTokenInteractively(interactiveRequest)).results
    }

    if (results && results.account && results.account.idTokenClaims) {
      let roles = Object
      .entries(results.account.idTokenClaims)
      .find(key=> key[0] === 'roles')?.[1]

      Store.dispatch(SetAuthenticationRoles(roles))
      Store.dispatch(SetAuthenticationAccount(results.account))
      Store.dispatch(SetAuthenticationResults(results))
      Store.dispatch(SetAuthenticationStatus(true))
    }
  }
}

export const endAuthenticatedSession = async() => {
  const MsalPlugin = Plugins.MsalPlugin
  const state = Store.getState()
  const account = state.SecurityInfoReducer.authenticationAccount

  if (account) {
    let response = (await MsalPlugin.logout({
      account: account,
      removeAccountFromCache: true,
      postLogoutRedirectUri: redirectUri()
    })).results

    if (!response) {
      throw new Error("Unable to logout")
    } else {
      Store.dispatch(SetAuthenticationStatus(false))
      Store.dispatch(SetAuthenticationRoles([]))
      Store.dispatch(RemoveAuthenticationAccount())
      Store.dispatch(RemoveAuthenticationResults()) 
    }
  } else {
    throw new Error("Account is missing from Redux Store. Please make sure the user is logged in.")
  }
}

```










### 3. Add Authentication Session Hook tp app

```ts
import React, { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import { startAuthenticatedSession } from './auth/AuthenticationSessions'
import '@assimalign/msal-capacitor-plugin'

const App: FC = (props: any) => {

  const isAuthenticated = useSelector((state: RootState) => state.SecurityInfoReducer.isAuthenticated)
  const authorizedRoles = useSelector((state: RootState) => state.SecurityInfoReducer.authenticationRoles)

  useEffect(() => {
    startAuthenticatedSession()
  }, []);

  if(isAuthenticated) {
    return (
      <>
        <h1>Authenticated</h1>
      </>
    )
  } else {
    return (
      <>
        <h1>Unauthenticated</h1>
      </>
    )
  }  
};

```

### 4. Update AppDelegate.swift file in App Folder of ios platform 
Because the Capacitor Callback bridge can't handle a redirect from a broker applicaiton we need to add the MSALPublicClientApplication Handler response to the ui return.

This happens when redirect are in applications like Microsoft Authenticator.


- Find the following applicaiton method below
  
  ```swift

   func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    // Called when the app was launched with a url. Feel free to add additional processing here,

    return CAPBridge.handleOpenUrl(url, options)
  }

  ```
- Add the following code

  ```swift
  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
      // Called when the app was launched with a url. Feel free to add additional processing here,

      var response = false
      
      response = MSALPublicClientApplication.handleMSALRespobse((url), sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String)
      response = CAPBridge.handleOpenUrl(url, options)
      
      return response
    }

  ```

---

## MSAL Capacitor Plugin Methods & Types
Below is a list of methods and return types that are exposed on both iOS and Web implementation. All types and methods replicate what is globally accepted across both platforms. 

### Methods
```ts
export interface IMsalPlugin {
  /**
   * Initiates the MSAL PublicApplicationClient for Web, iOS/macOS, and Android
   * @param options The Client configurations for the MSALPublicApplicationClient
   */
  initialize(options?:  MsalConfigurations ): Promise<{results: boolean}>;

  /**
   * Checks the device if Biometrics is available
   */
  isBiometricsAvailable(): Promise<{results: boolean}>;
  /**
   * Even if Biometrics Auth is Available we need to check whether the user has consented to using biomentrics for the app
   */
  canEvaluateBiometricsPolicy(): Promise<{results: boolean}>;
  /**
   * Will launch biometrics if Biometrics is available and the application can evaluate the biometrics policy
   */
  evaluateBiometricsPolicy(): Promise<{results: boolean}>;
  /**
   * Gets an account by username if available
   * @param options the username in which to search for within the cache
   */
  acquireAccountByUsername(params: { username: string }): Promise<{ results: MsalAccountInfo | undefined }>
  /**
   * Gets the active or most recent account used if available
   */
  acquireCurrentAccount(): Promise<{ results: MsalAccountInfo | null | undefined }>;
  /**
   * Get's all the account's within the platforms cache location.
   */
  acquireAllAccounts(): Promise<{ results: MsalAccountInfo[] | undefined }>;
  /**
   * 
   * @param options 
   */
  acquireTokenSilently(request: MsalSilentRequest): Promise<{ results: MsalAuthenticationResults }>;
  /**
   * 
   * @param options 
   */
  acquireTokenInteractively(request: MsalInteractiveRequest): Promise<{ results: MsalAuthenticationResults }>;
  /**
   * 
   * @param request 
   */
  login(request: MsalInteractiveRequest): Promise<{ results: MsalAuthenticationResults }>;
  /**
   * Will logout the account from current session with the specified provider. If the provider is not specified will use the default provider specified wihtin the PublicApplicationClient
   * @param options 
   */
}
```

### Types
```ts
export class MsalError{
 
  constructor() {
    this.errorCode = ''
    this.errorMessage = ''
  }
  /**
   * A short unique string denoting the error
   */
  errorCode: string;
  /**
   * A category descriptor for the error codes 
   */
  errorType?: string;
   /**
    * A generic message for 
    */
  errorMessage: string;
  /**
    * 
    */ 
  errorDetails?: string;
  /**
   * 
   */
  errorInfo?: Dictionary<any>;
  /**
   * 
   */
  stack?: any;
}

export declare type MsalConfigurations = {
  /**
   * (Cross-Platform Option)
   * The client ID of the application, this should come from the app developer portal
   */
  clientId: string;
  /**
   * (Cross-Platform Option)
   * You can configure a specific authority, defaults to " " or "https://login.microsoftonline.com/common"
   */
  authority?: string;
  /**
   * (Cross-Platform Option)
   * An array of URIs that are known to be valid. Used in B2C scenarios.
   */
  knownAuthorities?: Array<string>;
  /**
   * (Web Option Only)
   * A string containing the cloud discovery response. Used in AAD scenarios.
   */
  cloudDiscoveryMetadata?: string;
  /**
   * 
   */
  authorityMetadata?: string;
  /**
   * (Cross-Platform Option)
   * The redirect URI where authentication responses can be received by your application. It must exactly match one of the redirect URIs registered in the Azure portal.
   */
  redirectUri?: string;
  /**
   * (Web Option Only)
   * The redirect URI where the window navigates after a successful logout.
   */
  postLogoutRedirectUri?: string;
  /**
   * (Web Option Only)
   * Boolean indicating whether to navigate to the original request URL after the auth server navigates to the redirect URL.
   */
  navigateToLoginRequestUrl?: boolean;
  /**
   * (Cross-Platform Option)
   * Array of capabilities which will be added to the claims.access_token.xms_cc request property on every network request.
   */
  clientCapabilities?: Array<string>;
  /**
   * (Web Option Only)
   * Enum that represents the protocol that msal follows. Used for configuring proper endpoints.
   */
  protocolMode?: ProtocolMode;

  // Web Specific Options
  /**
   * (Web Option Only)
   * Used to specify the cacheLocation user wants to set. Valid values are "localStorage" and "sessionStorage"
   */
  cacheLocation?: "localStorage" | "sessionStorage" | "memoryStorage";
  /**
   * (Web Option Only)
   * If set, MSAL stores the auth request state required for validation of the auth flows in the browser cookies. By default this flag is set to false.
   */
  storeAuthStateInCookie?: boolean;
  /**
   * (Web Option Only)
   * Sets the timeout for waiting for a response hash in a popup. Will take precedence over loadFrameTimeout if both are set.
   */
  windowHashTimeout?: number;
  /**
   * (Web Option Only)
   * Sets the timeout for waiting for a response hash in an iframe. Will take precedence over loadFrameTimeout if both are set.
   */
  iframeHashTimeout?: number;
  /**
   * (Web Option Only)
   * Sets the timeout for waiting for a response hash in an iframe or popup
   */
  loadFrameTimeout?: number;
  /**
   * (Web Option Only)
   * Maximum time the library should wait for a frame to load
   */
  navigateFrameWait?: number;
  /**
   * (Web Option Only)
   * Time to wait for redirection to occur before resolving promise
   */
  redirectNavigationTimeout?: number;
  /**
   * (Web Option Only)
   * Sets whether popups are opened asynchronously. By default, this flag is set to false. When set to false, blank popups are opened before anything else happens. When set to true, popups are opened when making the network request.
   */
  asyncPopups?: boolean;
  /**
   * (Web Option Only)
   * Flag to enable redirect opertaions when the app is rendered in an iframe (to support scenarios such as embedded B2C login).
   */
  allowRedirectInIframe?: boolean;

  // iOS/macOS Specific Options
  /**
   * (iOS Option Only) 
   * Time in seconds controlling how long before token expiry MSAL refreshes access tokens. When checking an access token for expiration we check if time to expiration is less than this value (in seconds) before making the request. The goal is to refresh the token ahead of its expiration and also not to return a token that is about to expire.
   */
  tokenExpirationBuffer?: number;
  /**
   * (iOS Option)
   * Enable to return access token with extended lifetime during server outage.
   */
  extendedLifetimeEnabled?: boolean;
  /**
   * (iOS Option Only) 
   * For clients that support multiple national clouds, set this to YES. NO by default. If set to YES, the Microsoft identity platform will automatically redirect user to the correct national cloud during the authorization flow. You can determine the national cloud of the signed-in account by examining the authority associated with the MSALResult. Note that the MSALResult doesn’t provide the national cloud-specific endpoint address of the resource for which you request a token.
   */
  multipleCloudsSupported?: boolean;
  /**
   * (iOS Option Only)
   * MSAL configuration interface responsible for token caching and keychain configuration.
   */
  keychainSharingGroup?: string;
  /**
   * (Cross-Platform Option)
   * Due to state management accross frameworks applications tend to re-render. If set to true this 
   */
  guardForRerenders?: boolean;
}

export declare type MsalInteractiveRequest = {
  // Cross Platform Parameters
  /**
   * (Cross-Platform Option)
   * Array of scopes the application is requesting access to.
   */
  scopes: Array<string>;
  /**
   * (Cross-Platform Option)
   * AccountInfo obtained from a getAccount API. Will be used in certain scenarios to generate login_hint if both loginHint and sid params are not provided.
   */
  account?: MsalAccountInfo;
  /**
   * (Cross-Platform Option)
   * Url of the authority which the application acquires tokens from.
   */
  authority?: string;
  /**
   * (Cross-Platform Option)
   * Unique GUID set per request to trace a request end-to-end for telemetry purposes.
   */
  correlationId?: string;
  /**
   * In cases where Azure AD tenant admin has enabled conditional access policies, and the policy has not been met, exceptions will contain claims that need to be consented to.
   */
  claims?: string;
  /**
   * (Cross-Platform Option)
   * String to string map of custom query parameters added to the /authorize call
   */
  extraQueryParameters?: StringDictionary;
  /**
   * (Cross-Platform Option)
   * Scopes for a different resource when the user needs consent upfront.
   */
  extraScopesToConsent?: Array<string>;
  /**
   * (Cross-Platform Option)
   * Can be used to pre-fill the username/email address field of the sign-in page for the user, if you know the username/email address ahead of time. Often apps use this parameter during re-authentication, having already extracted the username from a previous sign-in using the preferred_username claim.
   */
  loginHint?: string;

  // Web Specific Options
  /**
   * (Cross-Platform Option)
   * The type of token retrieved. Defaults to "Bearer". Can also be type "pop".
   * - IMPORTANT NOTE: for 'POP' schema parameters 'resourceRequestUri' & 'resourceRequestMethod' are required
   */
  authenticationScheme?: AuthenticationScheme;
  /**
   * (Web Option)
   * The redirect URI where authentication responses can be received by your application. It must exactly match one of the redirect URIs registered in the Azure portal.
   */
  redirectUri?: string;
  /**
   * (Web Option)
   * Provides a hint about the tenant or domain that the user should use to sign in. The value of the domain hint is a registered domain for the tenant.
   */
  domainHint?: string;
  /**
   * (Cross-Platform Option)
   * A value included in the request that is returned in the id token. A randomly generated unique value is typically used to mitigate replay attacks.
   */
  nonce?: string;
  /**
   * (Cross-Platform Option)
   * Parameter options; 'consent', 'select_account', and 'login' are globally accepted inputs accross all platforms. 
   * - 'promptIfNecessary' is specific to iOS and will only try to prompt a popup if needed. 
   * - 'none' is specific to Web and will only try to prompt a popup if needed.
   */
  prompt?: 'consent' | 'select_account' | 'login' | 'promptIfNecessary' | 'none'; 
  /**
   * (iOS Option Only) 
   * The prompt view type to show when login input is needed.
   */
  promptView?: 'wkWebView' | 'authenticationSession' | 'safariViewController'; // for ios Only
  /**
   * (Web Option)
   * Session ID, unique identifier for the session. Available as an optional claim on ID tokens.
   */
  sid?: string;
  /**
   * (Web Option)
   * A value included in the request that is also returned in the token response. A randomly generated 
   * unique value is typically used for preventing cross site request forgery attacks. The state is also 
   * used to encode information about the user's state in the app before the authentication request occurred.
   */
  state?: string;
  /**
   * (Cross-Platform Option)
   * HTTP Request type used to request data from the resource (i.e. "GET", "POST", etc.).  Used for proof-of-possession flows.
   */
  resourceRequestMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'PATCH' | 'TRACE'
  /**
   * (Cross-Platform Option)
   * URI that token will be used for. Used for proof-of-possession flows.
   */
  resourceRequestUri?: string;

}

export declare type MsalEndSessionRequest = {
  /**
   * (Web Option)
   * Authority to send logout request to.
   */
  authority?: string;
  /**
   * (Web Option)
   * Unique GUID set per request to trace a request end-to-end for telemetry purposes.
   */
  correlationId?: string;
  /**
   * Account object that will be logged out of. All tokens tied to this account will be cleared.
   */
  account: MsalAccountInfo;
  /**
   * (Web Option)
   * URI to navigate to after logout page inside the popup. Required to ensure popup can be closed.
   */
  postLogoutRedirectUri?: string;
  /**
   * (Web Option Only)
   * URI to navigate the main window to after logout is complete
   */
  mainWindowRedirectUri?: string;
  /**
   * (Web Option Only)
   * ID Token used by B2C to validate logout if required by the policy
   */
  idTokenHint?: string;
  /**
   * (iOS Option Only)
   *  Will remove the account from the applicaion's keychain group. 
   * - NOTE: If the default keychain group is the same as microsoft's default keychain groups or is the default as any other application it will remove the account from all applicaitons.
   */
  removeAccountFromCache?: boolean;
  /**
   * (iOS Option Only)
   * Specifies whether signout should also open the browser and send a network request to the end_session_endpoint.
   * NO by default.
   */
  signoutFromBrowser?: boolean;
  /**
   * (iOS Option Only)
   * A specific webView type for the interactive authentication flow.
   * By default, it will be set to MSALGlobalConfig.defaultWebviewType.
   */
  promptView?: 'wkWebView' | 'authenticationSession' | 'safariViewController';
}

export declare type  MsalSilentRequest = {
  /**
   * (Cross-Platform Option)
   * Array of scopes the application is requesting access to.
   */
  scopes: Array<string>;
  /**
   * (Web Option)
   * String to string map of custom query parameters added to the /authorize call. Only used when renewing the refresh token.
   */
  extraQueryParameters?: StringDictionary;
  /**
   * (Web Option)
   * String to string map of custom query parameters added to the /token call. Only used when renewing access tokens.
   */
  tokenQueryParameters?: StringDictionary;
  /**
   * (Cross-Platform Option)
   * Url of the authority which the application acquires tokens from.
   */
  authority?: string;
  /**
   * (Cross-Platform Option)
   * AccountInfo obtained from a getAccount API. Will be used in certain scenarios to generate login_hint if both loginHint and sid params are not provided.
   */
  account: MsalAccountInfo;
  /**
   * (Cross-Platform Option)
   * Unique GUID set per request to trace a request end-to-end for telemetry purposes.
   */
  correlationId?: string;
  /**
   * (Cross-Platform Option)
   * Forces silent requests to make network calls if true.
   */
  forceRefresh?: boolean;
  /**
   * (Cross-Platform Option)
   * The type of token retrieved. Defaults to "Bearer". Can also be type "pop".
   * - IMPORTANT NOTE: for 'POP' schema parameters 'resourceRequestUri' & 'resourceRequestMethod' are required
   */
  authenticationScheme?: AuthenticationScheme;
  /**
   * (Cross-Platform Option)
   * A stringified claims request which will be added to all /authorize and /token calls
   */
  claims?: string;
  /**
   * (Cross-Platform Option)
   * HTTP Request type used to request data from the resource (i.e. "GET", "POST", etc.).  Used for proof-of-possession flows.
   */
  resourceRequestMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'PATCH' | 'TRACE'
  /**
   *  (Cross-Platform Option)
   * URI that token will be used for. Used for proof-of-possession flows.
   */
  resourceRequestUri?: string;
}

export declare type MsalAccountInfo = {
  /**
   * Home account identifier for this account object
   */
  homeAccountId: string;
  /**
   * Entity which issued the token represented by the domain of the issuer (e.g. login.microsoftonline.com)
   */
  environment: string;
  /**
   * Full tenant or organizational id that this account belongs to
   */
  tenantId: string;
  /**
   * preferred_username claim of the id_token that represents this account
   */
  username: string;
  /**
   * Local, tenant-specific account identifer for this account object, usually used in legacy cases
   */
  localAccountId: string;
  /**
   * Full name for the account, including given name and family name
   */
  name?: string;
  /**
   * Object contains claims from ID token
   */
  idTokenClaims?: object;
}

export declare type MsalAuthenticationResults = {
  /**
   * Url of the authority which the application acquires tokens from.
   */
  authority: string;
  /**
   * oid` or `sub` claim from ID token
   */
  uniqueId: string;
  /**
   * tid` claim from ID token
   */
  tenantId: string;
  /**
   * Scopes that are validated for the respective token
   */
  scopes: Array<string>;
  /**
   * An account object representation of the currently signed-in user
   */
  account: MsalAccountInfo | null;
  /**
   * Id token received as part of the response
   */
  idToken: string;
  /**
   * MSAL-relevant ID token claims
   */
  idTokenClaims: object;
  /**
   * Access token received as part of the response
   */
  accessToken: string;
  /**
   * Boolean denoting whether token came from cache
   */
  fromCache: boolean;
  /**
   * Javascript Date object representing relative expiration of access token
   */
  expiresOn: Date | null;
  /**
   * The schema type of the token (Bearer, pop, etc.)
   */
  tokenType: string;
  /**
   * Javascript Date object representing extended relative expiration of access token in case of server outage
   */
  extExpiresOn?: Date;
  /**
   * Value passed in by user in request
   */
  state?: string;
  /**
   * Family ID identifier, usually only used for refresh tokens
   */
  familyId?: string;
  /**
   * 
   */
  cloudGraphHostName?: string;
  /**
   * 
   */
  msGraphHost?: string;

  // iOS/macOS Options
  /**
   * (iOS Option) Some access tokens have extended lifetime when server is in an unavailable state. This property indicates whether the access token is returned in such a state.
   */
  extendedLifeTimeToken?: boolean;
}
```

---

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://rdlabo.jp">
      <img src="https://avatars.githubusercontent.com/u/46410573?s=60&amp;v=4" width="100px"><br /><sub><b>Chase Crawford</b></sub>
      </td>
  </tr>
</table>