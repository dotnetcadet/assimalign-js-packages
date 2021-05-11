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
