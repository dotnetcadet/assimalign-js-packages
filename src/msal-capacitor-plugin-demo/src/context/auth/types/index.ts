export interface IAuthContext {
    isAuthenticated: Function;
    login: Function;
    logout: Function;
    acquireUserRoles: Function;
    acquireAccessTokenForUser: Function;
    acquireAuthenticationResult: Function;
  }