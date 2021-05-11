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