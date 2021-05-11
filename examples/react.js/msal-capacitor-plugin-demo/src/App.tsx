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