import Foundation
import Capacitor
import MSAL
import LocalAuthentication


@objc(MsalCap)
public class MsalPlugin: CAPPlugin {
    // This will act as a constructor for initializing
    public override func load() {
        self.dateFormatter.dateFormat = "YY-MM-dd'T'HH:mm:ss"
    }

    var client: MSALPublicClientApplication?
    var hasOptions = Bool()
    var dateFormatter = DateFormatter()
    let laContext = LAContext()


    @objc func initialize(_ call: CAPPluginCall) {
        do {
             // 1. Sometimes Javascripts Apps cause re-renders resulting in options being set again
            // This protects from options being set again
            if (call.getBool("guardForRerenders") ?? false) == true && self.hasOptions == true {
                call.resolve([
                    "results": true
                ])
                return
            }
            
            let clientConfigurations = MSALPublicClientApplicationConfig(
                clientId: try call.getClientId(),
                redirectUri: try call.getRedirectUri(),
                authority: try call.getAuthority())
            
            clientConfigurations.extendedLifetimeEnabled = call.isExtendedLifetimeEnabled()
            clientConfigurations.multipleCloudsSupported = call.isMultipleCloudsSupported()
            clientConfigurations.tokenExpirationBuffer = call.getTokenExpirationBuffer()
            clientConfigurations.cacheConfig.keychainSharingGroup = call.getKeychainSharingGroup()
            clientConfigurations.clientApplicationCapabilities = call.getClientApplicationCapabilities()
            
            // Check to see if any known authorities was passed through
            if let knownAuthorities = try call.getKnownAuthorities() {
                clientConfigurations.knownAuthorities = knownAuthorities
            }
            
            self.client = try MSALPublicClientApplication(configuration: clientConfigurations)
            self.hasOptions = true
            
            call.resolve([
                "results": true
            ])
        } 
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
    
    

    @objc func isBiometricsAvailable(_ call: CAPPluginCall) {
        var error: NSError?
        
        if self.laContext.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            call.resolve([
                "results": true
            ])
        } else {
            call.resolve([
                "results": false
            ])
        }
    }
    
    @objc func canEvaluateBiometricsPolicy(_ call: CAPPluginCall) {
        var canEvaluateError: NSError?
        
        if self.laContext.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &canEvaluateError) {
            call.resolve([
                "results": true
            ])
        }
        else {
            call.resolve([
                "results": false
            ])
        }
    }
    
    /**
        
     */
    @objc func evaluateBiometricsPolicy(_ call: CAPPluginCall) {
        let reason = "To enable Silent Authentication"
    
        self.laContext.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { (success, evaluateError) in
            call.resolve([
                "results": success
            ])
        }
    }
    
    
    @objc func acquireAccountByUsername(_ call: CAPPluginCall) {
        do {
            let username = try call.getAccountUsernameParam()
            let account = try self.client?.account(forUsername: username)
            call.resolveAccount(account)
        }
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
    
    
    @objc func acquireCurrentAccount(_ call: CAPPluginCall) {
        do {
            let parameters = MSALAccountEnumerationParameters()
            parameters.returnOnlySignedInAccounts = true
            
            
            let currentAccount = try self.client?.accounts(for: parameters)
            call.resolveAccounts(currentAccount)
        }
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
    
    
    @objc func acquireAllAccounts(_ call: CAPPluginCall) {
        do {
            let accounts = try self.client?.allAccounts()
            call.resolveAccounts(accounts)
        }
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
    
    
    
    @objc func acquireTokenSilently(_ call: CAPPluginCall) {
        do {
            let scopes = call.getScopes()
            let account = try call.getAccount(self.client)
            let parameters = MSALSilentTokenParameters(scopes: scopes, account: account)
            parameters.forceRefresh = call.isForceRefresh()
            parameters.authority = call.checkForAuthority()
            parameters.authenticationScheme = try call.getAuthenticationSchema()
            parameters.correlationId = call.getCorrelationId()
            
            self.client?.acquireTokenSilent(with: parameters) { (results, error) in
                if let error = error {
                    let error = error as NSError
                    call.rejectRequest(error: error)
                    return
                }
                
                if let results = results {
                    call.resolveAuthenticationResults(results)
                    return
                }
            }
        }
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
    
    
    
    @objc func acquireTokenInteractively(_ call: CAPPluginCall) {
        do {
            let scopes = call.getScopes()
            let webview = MSALWebviewParameters(authPresentationViewController: self.bridge.viewController)
            webview.webviewType = call.getWebViewType()
            
            let parameters = MSALInteractiveTokenParameters(scopes: scopes, webviewParameters: webview)
            parameters.promptType = call.getPromptType()
            parameters.extraQueryParameters = call.getExtraQueryParameters()
            parameters.extraScopesToConsent = call.getExtraScopesToConsent()
            parameters.correlationId = call.getCorrelationId()
            parameters.authority = try call.getAuthority()
            parameters.loginHint = call.getLoginHint()
            parameters.authenticationScheme = try call.getAuthenticationSchema()
            parameters.account = call.checkForAccount(self.client)
            
            self.client?.acquireToken(with: parameters, completionBlock: { (results, error) in
                
                if let error = error {
                    let error = error as NSError
                    call.rejectRequest(error: error)
                    return
                }
                
                if let results = results {
                    call.resolveAuthenticationResults(results)
                    return
                }
            })
        }
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
    
    
    @objc func login(_ call: CAPPluginCall) {
        do {
        
            let scopes = call.getScopes()
            let webview = MSALWebviewParameters(authPresentationViewController: self.bridge.viewController)
            webview.webviewType = call.getWebViewType()
            
            let parameters = MSALInteractiveTokenParameters(scopes: scopes, webviewParameters: webview)
            parameters.promptType = call.getPromptType()
            parameters.extraQueryParameters = call.getExtraQueryParameters()
            parameters.extraScopesToConsent = call.getExtraScopesToConsent()
            parameters.correlationId = call.getCorrelationId()
            parameters.authority = try call.getAuthority()
            parameters.loginHint = call.getLoginHint()
            parameters.authenticationScheme = try call.getAuthenticationSchema()
            parameters.account = call.checkForAccount(self.client)
            
            self.client?.acquireToken(with: parameters, completionBlock: { (results, error) in
                if let error = error {
                    let error = error as NSError
                    call.rejectRequest(error: error)
                    return
                }
                
                if let results = results {
                    call.resolveAuthenticationResults(results)
                    return
                }
            })
        }
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
    
    
    @objc func logout(_ call: CAPPluginCall) {
        do {
            let account = try call.getAccount(self.client)
            let removeAccount = call.isRequestToRomoveAccount()

            let webview = MSALWebviewParameters(authPresentationViewController: self.bridge.viewController)
            webview.webviewType = call.getWebViewType()
        
            let parameters = MSALSignoutParameters(webviewParameters: webview)
            parameters.signoutFromBrowser = call.signoutFromBrowser()
            
            self.client?.signout(with: account, signoutParameters: parameters, completionBlock: { (success, error) in
                do {
                    if let error = error {
                        let error = error as NSError
                        call.rejectRequest(error: error)
                        return
                    }
                    
                    if removeAccount == true {
                        try self.client?.remove(account)
                    }
                    
                    call.resolve([
                        "results": success
                    ])
                }
                catch let error {
                    let error = error as NSError
                    call.rejectRequest(error: error)
                }
            })
        }
        catch let error {
            let error = error as NSError
            call.rejectRequest(error: error)
        }
    }
}


extension CAPPluginCall {
    
    public func getTokenExpirationBuffer() -> Double {
        if let expirationBuffer = self.getDouble("tokenExpirationBuffer") {
            return expirationBuffer
        } else {
            return 5
        }
    }
    
    public func getClientApplicationCapabilities() -> [String]? {
        if let clientCapabilities = self.getArray("clientCapabilities", String.self) {
            return clientCapabilities
        } else {
            return nil
        }
    }
    
    
    public func getKnownAuthorities() throws -> [MSALAuthority]? {
        do {
            var authorities = [MSALAuthority]()
            if let knownAuthorities = self.getArray("knownAuthorities", String.self) {
                for knownAuthority in knownAuthorities {
                    if let url = URL(string: knownAuthority) {
                        let authority = try MSALAuthority(url: url)
                        authorities.append(authority)
                    }
                }
                return authorities
            } else {
                return nil
            }
        }
        catch let error {
            throw error
        }
    }
    
    public func getTenantId() throws -> String {
        if let tenantid = self.getString("tenantId") {
            return tenantid
        } else {
            let error = NSError(
                domain: MSALErrorDomain,
                code: MSALError.internal.rawValue,
                userInfo: [
                    "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidParameter.rawValue,
                    "MSALErrorDescriptionKey": "Tenant Id must be present in MSAL Public Application Client Configurations"
                ])
            throw error
        }
    }
    
    public func getClientId() throws -> String {
        if let clientid = self.getString("clientId") {
            return clientid
        } else {
            let error = NSError(
                domain: MSALErrorDomain,
                code: MSALError.internal.rawValue,
                userInfo: [
                    "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidClient.rawValue,
                    "MSALErrorDescriptionKey": "Client Id must be present"
                ])
            throw error
        }
    }
    
    public func getRedirectUri() throws -> String {
        if let redirect = self.getString("redirectUri") {
            return redirect
        } else {
            let error = NSError(
                domain: MSALErrorDomain,
                code: MSALError.internal.rawValue,
                userInfo: [
                    "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidParameter.rawValue,
                    "MSALErrorDescriptionKey": "Redirect Uri must be present in Request"
                ])
            throw error
        }
    }
    
    public func checkForAuthority() -> MSALAuthority? {
        do {
            if let authority = self.getString("authority") {
                if let authorityUrl = URL(string: authority) {
                    return try MSALAuthority(url: authorityUrl)
                }
                return nil
            }
            return nil
        }
        catch {
            return nil
        }
        
    }
    
    public func getAuthority() throws -> MSALAuthority {
        let error = NSError(
            domain: MSALErrorDomain,
            code: MSALError.internal.rawValue,
            userInfo: [
                "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidParameter.rawValue,
                "MSALErrorDescriptionKey": "Authority must be present in Request"
            ])
        
        if let authority = self.getString("authority") {
            if let authorityUrl = URL(string: authority) {
                return try MSALAuthority(url: authorityUrl)
            }
            throw error
        } else {
            throw error
        }
    }
    
    public func isExtendedLifetimeEnabled() -> Bool {
        if let extendedLifetimeEnabled = self.getBool("extendedLifetimeEnabled") {
            return extendedLifetimeEnabled
        } else {
            return false
        }
    }
    
    public func isMultipleCloudsSupported() -> Bool {
        if let multipleCloudsSupported = self.getBool("multipleCloudsSupported") {
            return multipleCloudsSupported
        } else {
            return false
        }
    }
    
    public func getKeychainSharingGroup() -> String {
        if let keychainGroup = self.getString("keychainSharingGroup") {
            return keychainGroup
        } else {
            #if os(iOS)
                return "com.microsoft.adalcache"
            #else
                return "com.microsoft.identity.universalstorage"
            #endif
        }
    }
    
//    public func getClaimsRequest() -> MSALClaimsRequest {
//        let request = MSALClaimsRequest()
//        request.claimsRequests(for: )
//    }
    
    public func getNonce() -> String? {
        return self.getString("nonce")
    }
    
    public func getrResourceRequestMethod() throws -> MSALHttpMethod {
        let error = NSError(
            domain: MSALErrorDomain,
            code: MSALError.internal.rawValue,
            userInfo: [
                "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidParameter.rawValue,
                "MSALErrorDescriptionKey": "The ResourceRequestMethod must be present in Request"
            ])
        
        switch self.getString("resourceRequestMethod") {
        case "GET":
            return MSALHttpMethod.GET
        case "PUT":
            return MSALHttpMethod.PUT
        case "POST":
            return MSALHttpMethod.POST
        case "DELETE":
            return MSALHttpMethod.DELETE
        case "CONNECT":
            return MSALHttpMethod.CONNECT
        case "TRACE":
            return MSALHttpMethod.TRACE
        default:
            throw error
        }
    }
    
    public func getResourceRequestUri() throws -> URL {
        if let uri = self.getString("resourceRequestUri") {
            return URL(string: uri)!
        } else {
            let error = NSError(
                domain: MSALErrorDomain,
                code: MSALError.internal.rawValue,
                userInfo: [
                    "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidParameter.rawValue,
                    "MSALErrorDescriptionKey": "The ResourceRequestUri must be present in Request"
                ])
            throw error
        }
    }
    
    public func getAuthenticationSchema() throws -> MSALAuthenticationSchemeProtocol {
        do {
            if let schema = self.getString("authenticationSchema") {
                if schema == "Pop" {
                    return MSALAuthenticationSchemePop(
                        httpMethod: try self.getrResourceRequestMethod(),
                        request: try self.getResourceRequestUri(),
                        nonce: self.getNonce(), additionalParameters: nil)
                }
                
                return MSALAuthenticationSchemeBearer()
            } else {
                return MSALAuthenticationSchemeBearer()
            }
        }
        catch let error {
            throw error
        }
    }
    
    public func getLoginHint() -> String? {
        if let loginHint = self.getString("loginHint") {
            return loginHint
        } else {
            return nil
        }
    }
    
    public func getAccountUsernameParam() throws -> String {
        if let username = self.getString("username") {
            return username
        } else {
            let error = NSError(
                domain: MSALErrorDomain,
                code: MSALError.internal.rawValue,
                userInfo: [
                    "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidParameter.rawValue,
                    "MSALErrorDescriptionKey": "Username must be present in request"
                ])
            throw error
        }
    }
    
    public func resolveAccounts(_ accounts: [MSALAccount]?) {
        if let accounts = accounts {
            var accountCollection: [Any] = []
            for account in accounts {
                accountCollection.append([
                    "username": account.username,
                    "tenantId": account.accountClaims!["tid"],
                    "localAccountId": account.identifier,
                    "homeAccountId": account.homeAccountId?.identifier,
                    "idTokenclaims": account.accountClaims,
                    "environment": account.environment,
                    "name": account.accountClaims!["name"]
                ])
            }
            self.resolve([
                "results": [accountCollection]
            ])
        } else {
            self.resolve([
                "results": []
            ])
        }
    }
    
    public func getWebViewType() -> MSALWebviewType {
        if let webViewType = self.getString("promptView") {
            switch webViewType {
            case "wkWebView":
                return .wkWebView
            case "authenticationSession":
                return .authenticationSession
            case "safariViewController":
                return .safariViewController
            default:
                return .default
            }
        } else {
            return .default
        }
    }
    
    public func getPromptType() -> MSALPromptType {
        if let promptType = self.getString("prompt") {
            switch promptType {
            case "select_account":
                return .selectAccount
            case "consent":
                return .consent
            case "promptIfNecessary":
                return .promptIfNecessary
            case "login":
                return .login
            default:
                return .default
            }
        } else {
            return .default
        }
    }
    
    public func signoutFromBrowser() -> Bool {
        if let signoutFromBrowser = self.getBool("signoutFromBrowser") {
            return signoutFromBrowser
        } else {
            return false
        }
    }
    
    
    public func getScopes() -> [String] {
        if let scopes = self.getArray("scopes", String.self) {
            return scopes
        } else {
            return []
        }
    }

    public func checkForAccount(_ client: MSALPublicClientApplication?) -> MSALAccount? {
        do {
            if let account = self.getObject("account") {
                let account = try client?.account(forUsername: account["username"] as! String)
                if let foundAccount = account {
                    return foundAccount
                }
                return nil
            }
            return nil
        }
        catch {
            return nil
        }
    }
    
    public func getAccount(_ client: MSALPublicClientApplication?) throws -> MSALAccount {
        let error = NSError(
            domain: MSALErrorDomain,
            code: MSALError.internal.rawValue,
            userInfo: [
                "MSALInternalErrorCodeKey": MSALInternalError.errorInvalidParameter.rawValue,
                "MSALErrorDescriptionKey": "Username or localAccountId must be present in request"
            ])

        if let account = self.getObject("account") {
            if let username = account["username"] {
                if let userAccount = try client?.account(forUsername: username as! String) {
                    return userAccount
                }
            }
            else if let idTokenClaims = account["idTokenClaims"] {
                if let claims = idTokenClaims as? [String:Any] {
                    if let username = claims["preferred_username"] {
                        if let userAccount = try client?.account(forUsername: username as! String) {
                            return userAccount
                        }
                    }
                }
            }
            
            throw error
        }
        throw error
    }
    
    public func getExtraQueryParameters() -> [String:String]? {
        if let queryParams = self.getObject("extraQueryParameters") {
            return queryParams as? [String:String]
        } else {
            return [:]
        }
    }
    
    public func getExtraScopesToConsent() -> [String]? {
        if let scopes = self.getArray("extraScopesToConsent", String.self) {
            return scopes
        } else {
            return []
        }
    }

   
    public func getCorrelationId() -> UUID? {
        if let correlationId = self.getString("correlationId") {
            return UUID(uuidString: correlationId)
        } else {
            return nil
        }
    }
    
    public func isForceRefresh() -> Bool{
        if let forceRefresh = self.getBool("forceRefresh") {
            return forceRefresh
        } else {
            return false
        }
    }
    
    public func isRequestToRomoveAccount() -> Bool {
        if let removeAccount = self.getBool("removeAccountFromCache") {
            return removeAccount
        } else {
            return false
        }
    }
    
    public func resolveAccount(_ account: MSALAccount?) {
        if let account = account {
            self.resolve([
                "results": [
                    "username": account.username,
                    "tenantId": account.accountClaims!["tid"],
                    "localAccountId": account.identifier,
                    "homeAccountId": account.homeAccountId?.identifier,
                    "idTokenclaims": account.accountClaims,
                    "environment": account.environment,
                    "name": account.accountClaims!["name"]
                ]
            ])
        } else {
            self.resolve([
                "results": []
            ])
        }
    }
    
    
    public func resolveAuthenticationResults(_ results: MSALResult ) {
        let dateFormatter = DateFormatter()
  
        self.resolve([
            "results" : [
                "authority" : results.authority.url.absoluteString,
                "uniqueId": results.tenantProfile.identifier!,
                "tenantId" : results.tenantProfile.tenantId!,
                "scopes": results.scopes,
                "accessToken" : results.accessToken,
                "idToken" : results.idToken!, // ?? "" as String,
                "expiresOn": dateFormatter.string(from: results.expiresOn),
                "account": [
                    "name": results.account.accountClaims!["name"],
                    "username": results.account.username!,
                    "environment": results.account.environment,
                    "tenantId": results.tenantProfile.tenantId!,
                    "homeAccountId": results.account.homeAccountId?.identifier,
                    "localAccountId":  results.account.identifier,
                    "idTokenClaims": results.account.accountClaims
                ],
                "idTokenClaims": [
                    results.tenantProfile.claims
                ],
                "fromCache": results.extendedLifeTimeToken,
                "tokenType": results.authenticationScheme
            ]
        ])
    }
    
    public func rejectRequest(error: NSError) {
        
        print("Info: \(error.userInfo)")
        
        
        
        if error.domain == MSALErrorDomain {
            switch error.code {
            
            case MSALError.interactionRequired.rawValue:
                self.reject(error.localizedDescription, "\(error.code)",error, [
                    "errorType": "iosInteractionRequiredError",
                    "errorCode": "interaction_required",
                    "errorMessage": error.localizedDescription,
                    "errorDetails": error.userInfo["MSALErrorDescriptionKey"] as! String
                    //"errorInfo": error.userInfo
                ])
                return
                
            case MSALError.internal.rawValue: // Internal Errors will be treated as invalid requests to match msal.js
                self.reject(error.localizedDescription, "\(error.code)", error, [
                    "errorType": "iosInternalError",
                    "errorCode": getInternalErrorCode(error),
                    "errorMessage": error.localizedDescription,
                    "errorDetails": error.userInfo["MSALErrorDescriptionKey"] as! String,
                    "errorInfo": error.userInfo
                ])
                return

            case MSALError.serverDeclinedScopes.rawValue:
                self.reject(error.localizedDescription, "\(error.code)",error, [
                    "errorType": "iosServerDeclinedScopesError",
                    "errorCode": "server_declined_scopes",
                    "errorMessage": error.localizedDescription,
                    "errorDetails": error.userInfo["MSALErrorDescriptionKey"] as! String,
                    "errorInfo": error.userInfo
                ])
                return
                
            case MSALError.serverProtectionPoliciesRequired.rawValue:
                self.reject(error.localizedDescription, "\(error.code)",error, [
                    "errorType": "iosServerProtectionPoliciesRequired",
                    "errorCode": "server_protection_policies_required",
                    "errorMessage": error.localizedDescription,
                    "errorDetails": error.userInfo["MSALErrorDescriptionKey"] as! String,
                    "errorInfo": error.userInfo
                ])
                return
                
            case MSALError.userCanceled.rawValue: //
                self.reject(error.localizedDescription, "\(error.code)",error, [
                    "errorType": "iosUserCanceledError",
                    "errorCode": "user_canceled",
                    "errorMessage": error.localizedDescription,
                    "errorDetails": error.userInfo["MSALErrorDescriptionKey"] as! String,
                    "errorInfo": error.userInfo
                ])
                return
                
            case MSALError.workplaceJoinRequired.rawValue:
                self.reject(error.localizedDescription, "\(error.code)",error, [
                    "errorType": "iosWorkplaceJoinRequiredError",
                    "errorCode": "workplace_join_required",
                    "errorMessage": error.localizedDescription,
                    "errorDetails": error.userInfo["MSALErrorDescriptionKey"] as! String,
                    "errorInfo": error.userInfo
                ])
                return
                
            default:
                self.reject(error.localizedDescription, "\(error.code)", error, [
                    "errorType": "iosAmbiguousError",
                    "errorCode": "unknown",
                    "errorMessage": error.localizedDescription,
                    "errorInfo": error.userInfo
                ])
                return
            }
        } else {
            self.reject(error.localizedDescription, "\(error.code)", error, [
                "errorType": "iosAmbiguousError",
                "errorCode": "unknown",
                "errorMessage": error.localizedDescription,
                "errorInfo": error.userInfo
            ])
            return
        }
    }
    
    
    private func getInternalErrorCode(_ error: NSError) -> String {
        let internalErrorCode = error.userInfo["MSALInternalErrorCodeKey"] as! Int
        let internalError = MSALInternalError(rawValue: internalErrorCode)
        
        switch internalError {
            case .brokerNotAvailable: return "broker_not_available"
            case .errorAccountRequired: return "account_required"
            case .errorAmbiguousAccount: return "ambiguous_account"
            case .errorAttemptToOpenURLFromExtension: return "attempt_to_open_url_from_extension"
            case .errorAuthorizationFailed: return "authorization_failed"
            case .errorBrokerApplicationTokenReadFailed: return "broker_application_token_read_failed"
            case .errorBrokerApplicationTokenWriteFailed: return "broker_application_token_write_failed"
            case .errorBrokerBadResumeStateFound: return "broker_bad_resume_state_found"
            case .errorBrokerCorruptedResponse: return "broker_corrupted_response"
            case .errorBrokerKeyFailedToCreate: return "broker_key_failed_to_create"
            case .errorBrokerKeyNotFound: return "broker_key_not_found"
            case .errorBrokerMismatchedResumeState: return "broker_mismatched_resume_state"
            case .errorBrokerNoResumeStateFound: return "broker_no_resume_state_found"
            case .errorBrokerResponseDecryptionFailed: return "broker_response_decryption_failed"
            case .errorBrokerResponseHashMismatch: return "broker_response_hash_mismatch"
            case .errorBrokerResponseHashMissing: return "broker_response_hash_missing"
            case .errorBrokerResponseNotReceived: return "broker_response_not_received"
            case .errorBrokerUnknown: return "broker_unknown"
            case .errorFailedAuthorityValidation: return "failed_authority_validation"
            case .errorInteractiveSessionAlreadyRunning: return "interaction_in_progress"
            case .errorInvalidClient: return "invalid_client"
            case .errorInvalidGrant: return "invalid_grant"
            case .errorInvalidParameter: return "invalid_parameter"
            case .errorInvalidRequest: return "invalid_request"
            case .errorInvalidResponse: return "invalid_response"
            case .errorInvalidScope: return "invalid_scope"
            case .errorInvalidState: return "invalid_state"
            case .errorMismatchedUser: return "mismatch_user"
            case .errorNoViewController: return "no_view_controller"
            case .errorNonHttpsRedirect: return "non_http_redirect"
            case .errorRedirectSchemeNotRegistered: return "redirect_scheme_not_registered"
            case .errorSessionCanceled: return "session_canceled"
            case .errorUINotSupportedInExtension: return "ui_not_supported_in_extension"
            case .errorUnauthorizedClient: return "unauthorized_client"
            case .errorUnexpected: return "unexpected"
            case .errorUnhandledResponse: return "unhandled_response"
            default: return "unknown_error"
        }
    }
    
    
//    public func getCloudDiscoveryMetadata() -> String {
//
//    }
//    public var authorityMetadata: String?
//    public var postLogoutRedirectUri: String?
//    public var navigateToLoginRequestUrl: Bool?
//    public var clientCapabilities: [String]?
//    public var tokenExpirationBuffer: Int?
//    public var extendedLifetimeEnabled: Bool?
}