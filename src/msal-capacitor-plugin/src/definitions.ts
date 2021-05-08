import { 
  AuthenticationScheme,
  ProtocolMode
 } from '@azure/msal-browser';

declare module '@capacitor/core' {
  interface PluginRegistry {
    MsalPlugin: IMsalPlugin;
  }
}

export declare type Dictionary<T> ={
  [key: string]: T
}

export declare type StringDictionary = {
  [key: string]: string;
}

export const MsalErrorCollection: Dictionary<MsalError> ={
  client_info_decoding_error: {
    errorType: "clientAuthErrorMessage",
    errorCode: "client_info_decoding_error",
    errorMessage: "The client info could not be parsed/decoded correctly. Please review the trace to determine the root cause.",
  },
  client_info_empty_error: {
    errorType: "clientAuthErrorMessage",
    errorCode: "client_info_empty_error",
    errorMessage: "The client info was empty. Please review the trace to determine the root cause."
  },
  token_parsing_error: {
    errorType: "clientAuthErrorMessage",
    errorCode: "token_parsing_error",
    errorMessage: "Token cannot be parsed. Please review stack trace to determine root cause."
  },
  null_or_empty_token: {
    errorType: "clientAuthErrorMessage",
    errorCode: "null_or_empty_token",
    errorMessage: "The token is null or empty. Please review the trace to determine the root cause."
  },
  endpoints_resolution_error: {
    errorType: "clientAuthErrorMessage",
    errorCode: "endpoints_resolution_error",
    errorMessage: "Error: could not resolve endpoints. Please check network and try again."
  },
  network_error: {
    errorType: "clientAuthErrorMessage",
    errorCode: "network_error",
    errorMessage: "Network request failed. Please check network trace to determine root cause."
  },
  openid_config_error: {
    errorType: "clientAuthErrorMessage",
    errorCode: "openid_config_error",
    errorMessage: "Could not retrieve endpoints. Check your authority and verify the .well-known/openid-configuration endpoint returns the required endpoints."
  },
  hash_not_deserialized: {
    errorType: "clientAuthErrorMessage",
    errorCode: "hash_not_deserialized",
    errorMessage: "The hash parameters could not be deserialized. Please review the trace to determine the root cause."
  },
  blank_guid_generated: {
    errorType: "clientAuthErrorMessage",
    errorCode: "blank_guid_generated",
    errorMessage: "The guid generated was blank. Please review the trace to determine the root cause."
  },
  invalid_state: {
    errorType: "clientAuthErrorMessage",
    errorCode: "invalid_state",
    errorMessage: "State was not the expected format. Please check the logs to determine whether the request was sent using ProtocolUtils.setRequestState()."
  },
  state_mismatch: {
    errorType: "clientAuthErrorMessage",
    errorCode: "state_mismatch",
    errorMessage: "State mismatch error. Please check your network. Continued requests may cause cache overflow."
  },
  state_not_found: {
    errorType: "clientAuthErrorMessage",
    errorCode: "state_not_found",
    errorMessage: "State not found"
  },
  nonce_mismatch: {
    errorType: "clientAuthErrorMessage",
    errorCode: "nonce_mismatch",
    errorMessage: "Nonce mismatch error. This may be caused by a race condition in concurrent requests."
  },
  nonce_not_found: {
    errorType: "clientAuthErrorMessage",
    errorCode: "nonce_not_found",
    errorMessage: "nonce not found"
  },
  no_tokens_found: {
    errorType: "clientAuthErrorMessage",
    errorCode: "no_tokens_found",
    errorMessage: "No tokens were found for the given scopes, and no authorization code was passed to acquireToken. You must retrieve an authorization code before making a call to acquireToken()."
  },
  multiple_matching_tokens: {
    errorType: "clientAuthErrorMessage",
    errorCode: "multiple_matching_tokens",
    errorMessage: "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements such as authority or account."
  },
  multiple_matching_accounts: {
    errorType: "clientAuthErrorMessage",
    errorCode: "multiple_matching_accounts",
    errorMessage: "The cache contains multiple accounts satisfying the given parameters. Please pass more info to obtain the correct account"
  },
  multiple_matching_appMetadata: {
    errorType: "clientAuthErrorMessage",
    errorCode: "multiple_matching_appMetadata",
    errorMessage: "The cache contains multiple appMetadata satisfying the given parameters. Please pass more info to obtain the correct appMetadata"
  },
  request_cannot_be_made: {
    errorType: "clientAuthErrorMessage",
    errorCode: "request_cannot_be_made",
    errorMessage: "Token request cannot be made without authorization code or refresh token."
  },
  cannot_append_empty_scope: {
    errorType: "clientAuthErrorMessage",
    errorCode: "cannot_append_empty_scope",
    errorMessage: "Cannot append null or empty scope to ScopeSet. Please check the stack trace for more info."
  },
  cannot_remove_empty_scope: {
    errorType: "clientAuthErrorMessage",
    errorCode: "cannot_remove_empty_scope",
    errorMessage: "Cannot remove null or empty scope from ScopeSet. Please check the stack trace for more info."
  },
  cannot_append_scopeset: {
    errorType: "clientAuthErrorMessage",
    errorCode: "cannot_append_scopeset",
    errorMessage: "Cannot append ScopeSet due to error."
  },
  empty_input_scopeset: {
    errorType: "clientAuthErrorMessage",
    errorCode: "empty_input_scopeset",
    errorMessage: "Empty input ScopeSet cannot be processed."
  },
  device_code_polling_cancelled: {
    errorType: "clientAuthErrorMessage",
    errorCode: "device_code_polling_cancelled",
    errorMessage: "Caller has cancelled token endpoint polling during device code flow by setting DeviceCodeRequest.cancel = true."
  },
  device_code_expired: {
    errorType: "clientAuthErrorMessage",
    errorCode: "device_code_expired",
    errorMessage: "Device code is expired."
  },
  no_account_in_silent_request: {
    errorType: "clientAuthErrorMessage",
    errorCode: "no_account_in_silent_request",
    errorMessage: "Please pass an account object, silent flow is not supported without account information"
  },
  invalid_cache_record: {
    errorType: "clientAuthErrorMessage",
    errorCode: "invalid_cache_record",
    errorMessage: "Cache record object was null or undefined."
  },
  invalid_cache_environment: {
    errorType: "clientAuthErrorMessage",
    errorCode: "invalid_cache_environment",
    errorMessage: "Invalid environment when attempting to create cache entry"
  },
  no_account_found: {
    errorType: "clientAuthErrorMessage",
    errorCode: "no_account_found",
    errorMessage: "No account found in cache for given key."
  },
  no_crypto_object: {
    errorType: "clientAuthErrorMessage",
    errorCode: "no_crypto_object",
    errorMessage: "No crypto object detected. This is required for the following operation: "
  },
  invalid_cache_type: {
    errorType: "clientAuthErrorMessage",
    errorCode: "invalid_cache_type",
    errorMessage: "Invalid cache type"
  },
  unexpected_account_type: {
    errorType: "clientAuthErrorMessage",
    errorCode: "unexpected_account_type",
    errorMessage: "Unexpected account type."
  },
  unexpected_credential_type: {
    errorType: "clientAuthErrorMessage",
    errorCode: "unexpected_credential_type",
    errorMessage: "Unexpected credential type."
  },
  invalid_assertion: {
    errorType: "clientAuthErrorMessage",
    errorCode: "invalid_assertion",
    errorMessage: "Client assertion must meet requirements described in https://tools.ietf.org/html/rfc7515"
  },
  invalid_client_credential: {
    errorType: "clientAuthErrorMessage",
    errorCode: "invalid_client_credential",
    errorMessage: "Client credential (secret, certificate, or assertion) must not be empty when creating a confidential client. An application should at most have one credential"
  },
  token_refresh_required: {
    errorType: "clientAuthErrorMessage",
    errorCode: "token_refresh_required",
    errorMessage: "Cannot return token from cache because it must be refreshed. This may be due to one of the following reasons: forceRefresh parameter is set to true, claims have been requested, there is no cached access token or it is expired."
  },
  user_timeout_reached: {
    errorType: "clientAuthErrorMessage",
    errorCode: "user_timeout_reached",
    errorMessage: "User defined timeout for device code polling reached",
  },
  token_claims_cnf_required_for_signedjwt: {
    errorType: "clientAuthErrorMessage",
    errorCode: "token_claims_cnf_required_for_signedjwt",
    errorMessage: "Cannot generate a POP jwt if the token_claims are not populated"
  },
  authorization_code_missing_from_server_response: {
    errorType: "clientAuthErrorMessage",
    errorCode: "authorization_code_missing_from_server_response",
    errorMessage: "Server response does not contain an authorization code to proceed"
  },
  access_token_entity_null: {
    errorType: "clientAuthErrorMessage",
    errorCode: "access_token_entity_null",
    errorMessage: "Access token entity is null, please check logs and cache to ensure a valid access token is present."
  },
  redirect_uri_empty: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "redirect_uri_empty",
    errorMessage: "A redirect URI is required for all calls, and none has been set."
  },
  post_logout_uri_empty: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "post_logout_uri_empty",
    errorMessage: "A post logout redirect has not been set."
  },
  claims_request_parsing_error: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "claims_request_parsing_error",
    errorMessage: "Could not parse the given claims request object."
  },
  authority_uri_insecure: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "authority_uri_insecure",
    errorMessage: "Authority URIs must use https.  Please see here for valid authority configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options"
  },
  url_parse_error: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "url_parse_error",
    errorMessage: "URL could not be parsed into appropriate segments."
  },
  empty_url_error: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "empty_url_error",
    errorMessage: "URL was empty or null."
  },
  empty_input_scopes_error: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "empty_input_scopes_error",
    errorMessage: "Scopes cannot be passed as null, undefined or empty array because they are required to obtain an access token."
  },
  nonarray_input_scopes_error: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "nonarray_input_scopes_error",
    errorMessage: "Scopes cannot be passed as non-array."
  },
  clientid_input_scopes_error: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "clientid_input_scopes_error",
    errorMessage: "Client ID can only be provided as a single scope."
  },
  invalid_prompt_value: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "invalid_prompt_value",
    errorMessage: "Supported prompt values are 'login', 'select_account', 'consent' and 'none'.  Please see here for valid configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options",
  },
  invalid_claims: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "invalid_claims",
    errorMessage: "Given claims parameter must be a stringified JSON object."
  },
  token_request_empty: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "token_request_empty",
    errorMessage: "Token request was empty and not found in cache."
  },
  logout_request_empty: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "logout_request_empty",
    errorMessage: "The logout request was null or undefined."
  },
  invalid_code_challenge_method: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "invalid_code_challenge_method",
    errorMessage: "code_challenge_method passed is invalid. Valid values are \"plain\" and \"S256\"."
  },
  pkce_params_missing: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "pkce_params_missing",
    errorMessage: "Both params: code_challenge and code_challenge_method are to be passed if to be sent in the request"
  },
  invalid_cloud_discovery_metadata: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "invalid_cloud_discovery_metadata",
    errorMessage: "Invalid cloudDiscoveryMetadata provided. Must be a JSON object containing tenant_discovery_endpoint and metadata fields"
  },
  invalid_authority_metadata: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "invalid_authority_metadata",
    errorMessage: "Invalid authorityMetadata provided. Must by a JSON object containing authorization_endpoint, token_endpoint, end_session_endpoint, issuer fields."
  },
  untrusted_authority: {
    errorType: "clientConfigurationErrorMessage",
    errorCode: "untrusted_authority",
    errorMessage: "The provided authority is not a trusted authority. Please include this authority in the knownAuthorities config parameter."
  },
  pkceNotGenerated: {
    errorCode: "pkce_not_created",
    errorMessage: "The PKCE code challenge and verifier could not be generated."
  },
  cryptoDoesNotExist: {
    errorCode: "crypto_nonexistent",
    errorMessage: "The crypto object or function is not available."
  },
  http_method_not_implemented: {
    errorType: "browserAuthErrorMessage",
    errorCode: "http_method_not_implemented",
    errorMessage: "The HTTP method given has not been implemented in this library."
  },
  empty_navigate_uri: {
    errorType: "browserAuthErrorMessage",
    errorCode: "empty_navigate_uri",
    errorMessage: "Navigation URI is empty. Please check stack trace for more info."
  },
  hash_empty_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "hash_empty_error",
    errorMessage: "Hash value cannot be processed because it is empty. Please verify that your redirectUri is not clearing the hash."
  },
  no_state_in_hash: {
    errorType: "browserAuthErrorMessage",
    errorCode: "no_state_in_hash",
    errorMessage: "Hash does not contain state. Please verify that the request originated from msal."
  },
  hash_does_not_contain_known_properties: {
    errorType: "browserAuthErrorMessage",
    errorCode: "hash_does_not_contain_known_properties",
    errorMessage: "Hash does not contain known properites. Please verify that your redirectUri is not changing the hash."
  },
  unable_to_parse_state: {
    errorType: "browserAuthErrorMessage",
    errorCode: "unable_to_parse_state",
    errorMessage: "Unable to parse state. Please verify that the request originated from msal."
  },
  state_interaction_type_mismatch: {
    errorType: "browserAuthErrorMessage",
    errorCode: "state_interaction_type_mismatch",
    errorMessage: "Hash contains state but the interaction type does not match the caller."
  },
  consent_required: {
    errorType: "internalError",
    errorCode: "interaction_required",
    errorMessage: "The request requires user interaction. For example, an additional authentication step is required.	Retry the request with the same resource, interactively, so that the user can complete any challenges required."
  },
  login_required: {
    errorType: "internalError",
    errorCode: "interaction_required",
    errorMessage: "The request requires user interaction. For example, an additional authentication step is required.	Retry the request with the same resource, interactively, so that the user can complete any challenges required."
  },
  interaction_required: {
    errorType: "internalError",
    errorCode: "interaction_required",
    errorMessage: "The request requires user interaction. For example, an additional authentication step is required.	Retry the request with the same resource, interactively, so that the user can complete any challenges required."
  },
  invalid_options_set : {
    errorType: 'internalError',
    errorCode: 'invalid_options_set',
    errorMessage: 'Options were either not possed or have in correct format. Please insure options are being passed in correctly.'
  },
  unsupported_grant_type: {
    errorType: "internalError",
    errorCode: "unsupported_grant_type",
    errorMessage: "The authorization server does not support the authorization grant type.	Change the grant type in the request. This type of error should occur only during development and be detected during initial testing."
  },
  invalid_resource: {
    errorType: "internalError",
    errorCode: "invalid_resource",
    errorMessage: "The target resource is invalid because it does not exist, Azure AD can't find it, or it's not correctly configured.	This indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. During development, this usually indicates an incorrectly setup test tenant or a typo in the name of the scope being requested."
  },
  temporarily_unavailable: {
    errorType: "internalError",
    errorCode: "temporarily_unavailable",
    errorMessage: "The server is temporarily too busy to handle the request.	Retry the request. The client application might explain to the user that its response is delayed because of a temporary condition."
  },
  interaction_in_progress: {
    errorType: "browserAuthErrorMessage",
    errorCode: "interaction_in_progress",
    errorMessage: "Interaction is currently in progress. Please ensure that this interaction has been completed before calling an interactive API.  For more visit: aka.ms/msaljs/browser-errors."
  },
  popup_window_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "popup_window_error",
    errorMessage: "Error opening popup window. This can happen if you are using IE or if popups are blocked in the browser."
  },
  empty_window_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "empty_window_error",
    errorMessage: "window.open returned null or undefined window object."
  },
  user_cancelled: {
    errorType: "browserAuthErrorMessage",
    errorCode: "user_cancelled",
    errorMessage: "User cancelled the flow."
  },
  monitor_window_timeout: {
    errorType: "browserAuthErrorMessage",
    errorCode: "monitor_window_timeout",
    errorMessage: "Token acquisition in popup failed due to timeout."
  },
  redirect_in_iframe: {
    errorType: "browserAuthErrorMessage",
    errorCode: "redirect_in_iframe",
    errorMessage: "Code flow is not supported inside an iframe. Please ensure you are using MSAL.js in a top frame of the window if using the redirect APIs, or use the popup APIs."
  },
  block_iframe_reload: {
    errorType: "browserAuthErrorMessage",
    errorCode: "block_iframe_reload",
    errorMessage: "Request was blocked inside an iframe because MSAL detected an authentication response. For more visit: aka.ms/msaljs/browser-errors"
  },
  block_nested_popups: {
    errorType: "browserAuthErrorMessage",
    errorCode: "block_nested_popups",
    errorMessage: "Request was blocked inside a popup because MSAL detected it was running in a popup."
  },
  iframe_closed_prematurely: {
    errorType: "browserAuthErrorMessage",
    errorCode: "iframe_closed_prematurely",
    errorMessage: "The iframe being monitored was closed prematurely."
  },
  silent_sso_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "silent_sso_error",
    errorMessage: "Silent SSO could not be completed - insufficient information was provided. Please provide either a loginHint or sid."
  },
  no_account_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "no_account_error",
    errorMessage: "No account object provided to acquireTokenSilent and no active account has been set. Please call setActiveAccount or provide an account on the request."
  },
  silent_prompt_value_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "silent_prompt_value_error",
    errorMessage: "The value given for the prompt value is not valid for silent requests - must be set to 'none'."
  },
  no_token_request_cache_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "no_token_request_cache_error",
    errorMessage: "No token request in found in cache."
  },
  unable_to_parse_token_request_cache_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "unable_to_parse_token_request_cache_error",
    errorMessage: "The cached token request could not be parsed."
  },
  no_cached_authority_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "no_cached_authority_error",
    errorMessage: "No cached authority found."
  },
  auth_request_not_set_error: {
    errorType: "browserAuthErrorMessage",
    errorCode: "auth_request_not_set_error",
    errorMessage: "Auth Request not set. Please ensure initiateAuthRequest was called from the InteractionHandler"
  },
  non_browser_environment: {
    errorType: "browserAuthErrorMessage",
    errorCode: "non_browser_environment",
    errorMessage: "Login and token requests are not supported in non-browser environments."
  },
  database_not_open: {
    errorType: "browserAuthErrorMessage",
    errorCode: "database_not_open",
    errorMessage: "Database is not open!"
  },
  no_network_connectivity: {
    errorType: "browserAuthErrorMessage",
    errorCode: "no_network_connectivity",
    errorMessage: "No network connectivity. Check your internet connection."
  },
  post_request_failed: {
    errorType: "browserAuthErrorMessage",
    errorCode: "post_request_failed",
    errorMessage: "Network request failed: If the browser threw a CORS error, check that the redirectUri is registered in the Azure App Portal as type 'SPA'"
  },
  get_request_failed: {
    errorType: "browserAuthErrorMessage",
    errorCode: "get_request_failed",
    errorMessage: "Network request failed. Please check the network trace to determine root cause."
  },
  failed_to_parse_response: {
    errorType: "browserAuthErrorMessage",
    errorCode: "failed_to_parse_response",
    errorMessage: "Failed to parse network response. Check network trace."
  },
  broker_not_available: {
    errorType: "iosInternalError",
    errorCode: "broker_not_available",
    errorMessage: ""
  },
  account_required: {
    errorType: "iosInternalError",
    errorCode: "account_required",
    errorMessage: ""
  },
  ambiguous_account: {
    errorType: "iosInternalError",
    errorCode: "ambiguous_account",
    errorMessage: ""
  },
  attempt_to_open_url_from_extension: {
    errorType: "iosInternalError",
    errorCode: "attempt_to_open_url_from_extension",
    errorMessage: ""
  },
  authorization_failed: {
    errorType: "iosInternalError",
    errorCode: "authorization_failed",
    errorMessage: ""
  },
  broker_application_token_read_failed: {
    errorType: "iosInternalError",
    errorCode: "broker_application_token_read_failed",
    errorMessage: ""
  },
  broker_application_token_write_failed: {
    errorType: "iosInternalError",
      errorCode: "broker_application_token_write_failed",
      errorMessage: ""
  },
  broker_bad_resume_state_found: {
    errorType: "iosInternalError",
    errorCode: "broker_bad_resume_state_found",
    errorMessage: ""
  },
  broker_corrupted_response: {
    errorType: "iosInternalError",
    errorCode: "broker_corrupted_response",
    errorMessage: ""
  },
  broker_key_failed_to_create: {
    errorType: "iosInternalError",
    errorCode: "broker_key_failed_to_create",
    errorMessage: ""
  },
  broker_key_not_found: {
    errorType: "iosInternalError",
    errorCode: "broker_key_not_found",
    errorMessage: ""
  },
  broker_mismatched_resume_state: {
    errorType: "iosInternalError",
    errorCode: "broker_mismatched_resume_state",
    errorMessage: ""
  },
  broker_no_resume_state_found: {
    errorType: "iosInternalError",
    errorCode: "broker_no_resume_state_found",
    errorMessage: ""
  },
  broker_response_decryption_failed: {
    errorType: "iosInternalError",
    errorCode: "broker_response_decryption_failed",
    errorMessage: ""
  },
  broker_response_hash_mismatch: {
    errorType: "iosInternalError",
    errorCode: "broker_response_hash_mismatch",
    errorMessage: ""
  },
  broker_response_hash_missing: {
    errorType: "iosInternalError",
    errorCode: "broker_response_hash_missing",
    errorMessage: ""
  },
  broker_response_not_received: {
    errorType: "iosInternalError",
    errorCode: "broker_response_not_received",
    errorMessage: ""
  },
  broker_unknown: {
    errorType: "iosInternalError",
    errorCode: "broker_unknown",
    errorMessage: ""
  },
  failed_authority_validation: {
    errorType: "iosInternalError",
    errorCode: "failed_authority_validation",
    errorMessage: ""
  },
  invalid_client: {
    errorType: "internalError",
    errorCode: "invalid_client",
    errorMessage: "Client authentication failed.	The client credentials aren't valid. To fix, the application administrator updates the credentials."
  },
  invalid_grant: {
    errorType: "internalError",
    errorCode: "invalid_grant",
    errorMessage: "Some of the authentication material (auth code, refresh token, access token, PKCE challenge) was invalid, unparseable, missing, or otherwise unusable	Try a new request to the /authorize endpoint to get a new authorization code. Consider reviewing and validating that app's use of the protocols."
  },
  invalid_parameter: {
    errorType: "iosInternalError",
    errorCode: "invalid_parameter",
    errorMessage: ""
  },
  invalid_request: {
    errorType: "internalError",
    errorCode: "invalid_request",
    errorMessage: "Protocol error, such as a missing required parameter.	Fix and resubmit the request."
  },
  invalid_response: {
    errorType: "iosInternalError",
    errorCode: "invalid_response",
    errorMessage: ""
  },
  invalid_scope: {
    errorType: "iosInternalError",
    errorCode: "invalid_scope",
    errorMessage: ""
  },
  mismatch_user: {
    errorType: "iosInternalError",
    errorCode: "mismatch_user",
    errorMessage: ""
  },
  no_view_controller: {
    errorType: "iosInternalError",
    errorCode: "no_view_controller",
    errorMessage: ""
  },
  non_http_redirect: {
    errorType: "iosInternalError",
    errorCode: "non_http_redirect",
    errorMessage: ""
  },
  redirect_scheme_not_registered: {
    errorType: "iosInternalError",
    errorCode: "redirect_scheme_not_registered",
    errorMessage: ""
  },
  session_canceled: {
    errorType: "iosInternalError",
    errorCode: "session_canceled",
    errorMessage: ""
  },
  ui_not_supported_in_extension: {
    errorType: "iosInternalError",
    errorCode: "ui_not_supported_in_extension",
    errorMessage: ""
  },
  unauthorized_client: {
    errorType: "internalError",
    errorCode: "unauthorized_client",
    errorMessage: "The authenticated client isn't authorized to use this authorization grant type.	This usually occurs when the client application isn't registered in Azure AD or isn't added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD."
  },
  unexpected: {
    errorType: "iosInternalError",
    errorCode: "unexpected",
    errorMessage: ""
  },
  unhandled_response: {
    errorType: "iosInternalError",
    errorCode: "unhandled_response",
    errorMessage: ""
  },
  no_options: {
    errorType: "internalError",
    errorCode: "no_options",
    errorMessage: "Options has not been set.",
    errorDetails: ""
  }
}

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

/**
 * IMsalPlugin
 * - acquireCurrentAccount        - 
 * - acquireAllAccounts           - Gets all accounts within the cached locations for this application
 * - acquireTokenSilently         - Acquires a token sinlenty based on the account specified
 * - acquireTokenInteractively    - N/A
 * - login                        - Will first attempt to acquire a token silently then 
 * - logout                       - Will remove 
 */
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
  logout(request: MsalEndSessionRequest): Promise<{results: boolean}>;
}