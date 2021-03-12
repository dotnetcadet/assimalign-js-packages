import Foundation
import Capacitor
import MSAL
import LocalAuthentication

@objc(MsalCap)
public class MsalPlugin: CAPPlugin {
    
    typealias AccountCompletion = (MSALAccount?) -> Void
    
    var msalInitializationCount = Int()

    var msalAccount: MSALAccount?
    var msalResults: MSALResult?
    var msalClient: MSALPublicClientApplication?
    // Struct Initialization Default is False, setting this in setOptions resulted in error due to reset of options when a rerender occurrs
    //
    var msalAuthenticated = Bool()
    var msalUseBiometrics = Bool()
    var msalPopupScopes: [String]?
    var msalHasOptions = Bool()
    
    var msalLocalAuthContext = LAContext()
    
    var dateFormatter = DateFormatter()
    var loggingText = String()

    // This will act as a constructor for initializing
    public override func load() {
        
        self.dateFormatter.dateFormat = "YY-MM-dd'T'HH:mm:ss"
    }
    

    @objc func setOptions(_ call: CAPPluginCall) {
        do {
            // 1. Sometimes Javascripts Apps cause re-renders resulting in options being set again
            // This protects from options being set again
            if (call.getBool("guardForRerenders") ?? false) == true && self.msalHasOptions == true {
                return
            }
            
            // 2. Validate all Options have been passed from  Plugin bridge
            guard let authorityUri = call.getString("authority") else { return }
            guard let clientId = call.getString("clientId") else {return }
            guard let redirectUri  = call.getString("redirectUri") else {return }
            guard let authorityUrl = URL(string: authorityUri ) else {return }

            // 3. If made it this point, then set & create Configuraitons, Authority, & Public Client
            let clientAuthority = try MSALAADAuthority(url: authorityUrl)
            let clientConfiguration = MSALPublicClientApplicationConfig(clientId: clientId, redirectUri: redirectUri, authority: clientAuthority)
            
            // 4. Set iOS Options
            if let isoOptions = call.getObject("iosOptions") {
                if isoOptions["enableBiometrics"] == nil {
                    self.msalUseBiometrics = false
                } else {
                    self.msalUseBiometrics = isoOptions["enableBiometrics"] as! Bool;
                }
                
                var tokenCache = ""

                 #if os(iOS)
                 if isoOptions["keyShareLocation"] == nil {
                     tokenCache = "com.microsoft.adalcache"
                 } else {
                     tokenCache = isoOptions["keyShareLocation"] as! String
                 }
                 #else
                 if isoOptions["keyShareLocation"] == nil {
                     tokenCache = "com.microsoft.identity.universalstorage"
                 } else {
                     tokenCache = isoOptions["keyShareLocation"] as! String
                 }
                 #endif
                 clientConfiguration.cacheConfig.keychainSharingGroup = tokenCache

               
            } else {
                self.msalUseBiometrics = false
            }
            
            // Step 03: Set plugin errors
            self.msalClient = try MSALPublicClientApplication(configuration: clientConfiguration)
            self.msalPopupScopes = call.getArray("scopes", String.self)
            self.msalHasOptions = true

            // Step 04: Need to resolve void and send response back to the bridge
            call.resolve()
            
        } catch let error {
            call.error("Initialization Error", error, [
                "results": "Unable to set options in iOS Plugin"
            ])
        }
    }
    
    
    @objc func acquireAccessTokenForUser(_ call: CAPPluginCall) {
        // 1. Check if Options have been set
        if self.msalHasOptions == false {
            call.reject("AcquireAccessTokenForUser Error: MSAL Plugin Options have not been set yet. Please run 'setOptions'")
            return
        }

        if self.msalAuthenticated == true {
            // 2.
            let msalParameters = MSALParameters()
            msalParameters.completionBlockQueue = DispatchQueue.main
            
            self.msalClient?.getCurrentAccount(with: msalParameters, completionBlock: { (currentAccount, previousAccount, error)  in
                if let currentAccount = currentAccount {
                    self.msalAccount = currentAccount
                }
            })
            
            // 3. Validate and set scopes where passed through options
            guard let tokenScopes = call.getArray("scopes", String.self) else {
                call.reject("AcquireAccessToken Error: No Scopes were provided")
                return
            }

            // 4. Set Silent Token Parameters
            let parameters = MSALSilentTokenParameters(scopes: tokenScopes, account: self.msalAccount!)
            if (call.getBool("forceRefresh") ?? false) == true {
                parameters.forceRefresh = true
            }

            
            // 5. Begin acquireing Access Token for OBO Flow and other Open ID Connect Prtocols
            self.msalClient?.acquireTokenSilent(with: parameters, completionBlock: { (response, error) in
                if let error = error {
                    call.error("AcquireAccessToken Error: Unable to Acquire Access Token", error, [
                        "unexpectedError": error.localizedDescription
                    ])
                    return
                }

                guard let response = response else {
                    call.reject("AcquireAccessToken Error: Could not acquire token: No result returned")
                    return
                }
                
                call.resolve([
                    "results": response.accessToken
                ])
            })
        } else {
            call.reject("AcquireAccessToken Error: User has not been Authenticated yet. Please Login first before calling this request")
        }
    }

    @objc func acquireUserRoles(_ call: CAPPluginCall) {
        // 1. Check if Options have been set
        if self.msalHasOptions == false {
            call.reject("AcquireUserRoles Error: MSAL Plugin Options have not been set yet. Please run 'setOptions'")
            return
        }
        
        // 2. Check if User has been authenticated
        if self.msalAuthenticated == true {
            guard let claims = self.msalAccount?.accountClaims else {
                call.resolve([
                    "results": []
                ])
                return
            }
            
            // 3. Cast Claims as String array
            let roles = claims["roles"] as? [String]
            
            // 4. Return Roles
            call.resolve([
                "results": roles
            ])
            
        } else {
            call.reject("Eiether Plugin Confgiuraitons have not been set or the user has not been authenticated")
        }
    }
    
    @objc func acquireAuthenticationResult(_ call: CAPPluginCall) {
        // Step 01: Check if Options have been set
        if self.msalHasOptions == false {
            call.reject("AcquireAuthenticationResult Error:  MSAL Plugin Options have not been set yet. Please run 'setOptions'")
            return
        }
        
        if self.msalResults == nil {
            call.resolve([
                "results": []
            ])
            return
        }
        self.resolveAuthenticationResults(call, self.msalResults)
    }
        
    @objc func isAuthenticated(_ call: CAPPluginCall) {
        // 1. Check if Options have been set
        if self.msalHasOptions == false {
            call.reject("isAuthenticated Error: MSAL Plugin Options have not been set yet. Please run 'setOptions'")
            return
        }

        call.resolve([
            "results": self.msalAuthenticated
        ])
    }
     
    @objc func login(_ call: CAPPluginCall)  {
        // 1. Check if Options have been set
        if self.msalHasOptions == false {
            call.reject("Login Error: MSAL Plugin Options have not been set yet. Please run 'setOptions'")
            return
        }
        
        if(self.msalUseBiometrics == true && self.isBiometricAvaiable() == true) {
            var canEvaluateError: NSError?

            if self.msalLocalAuthContext.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &canEvaluateError){
                let reason = "For biometric authentication"
                self.msalLocalAuthContext.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { (success, evaluateError) in
                    if success {
                        DispatchQueue.main.async {
                            self.setCurrentAccount {(account) in
                                guard let currentAccount = account else {
                                    self.loginInteractive(call)
                                    return
                                }
                                self.loginSilently(currentAccount, call)
                            }
                        }
                    }
                }
            } else {
                call.reject("Biometrics Failed")
            }
        } else {
            DispatchQueue.main.async {
                self.setCurrentAccount {(account) in
                    guard let currentAccount = self.msalAccount else {
                        self.loginInteractive(call)
                        return
                    }
                    self.loginSilently(currentAccount, call)
                }
            }
        }
    }
    
    @objc func logout(_ call: CAPPluginCall) {
        // Step 01: Check if Options have been set
        if self.msalHasOptions == false {
            call.reject("Logout Error: MSAL Plugin Options have not been set yet. Please run 'setOptions'")
            return
        }

        DispatchQueue.main.async {
            self.logoutInteractive(call)
        }
    }
    
    
    // This will check to see if there are any avaiable accounts already cached on the device
    // If any account is found it will load it and try to up
    private func setCurrentAccount(completion: AccountCompletion? = nil) {
        let msalParameters = MSALParameters()
        msalParameters.completionBlockQueue = DispatchQueue.main
                
        self.msalClient?.getCurrentAccount(with: msalParameters, completionBlock: { (currentAccount, previousAccount, error) in
            if let error = error {
                if let completion = completion {
                    completion(nil)
                }

                return
            }
            
            if let currentAccount = currentAccount {
                self.msalAccount = currentAccount
                if let completion = completion {
                    completion(self.msalAccount)
                }
                return
            }
            
            self.msalAccount = nil
  
            if let completion = completion {
                completion(nil)
            }
        })
    }
    
    
    private func logoutInteractive(_ call: CAPPluginCall) {
        do {
            // 1. Set Web View Parameters  for iOS or macos
            #if os(iOS)
            let webViewParameters = MSALWebviewParameters(authPresentationViewController: self.bridge.viewController)
            #else
            let webViewParameters = MSALWebviewParameters()
            #endif

            let signoutParameters = MSALSignoutParameters(webviewParameters: webViewParameters)
            signoutParameters.signoutFromBrowser = true

            self.msalClient?.signout(with: self.msalAccount!, signoutParameters: signoutParameters, completionBlock: {(success, error) in
                if let error = error {
                    call.error("SignOut Error: Unable to Signout", error, [
                        "unexpectedError": error.localizedDescription
                    ])
                    return
                }
                // 3. Reset all variables
                self.msalAccount = nil
                self.msalResults = nil
                self.msalAuthenticated = false

                call.resolve()
            })
        }
    }
    
    private func loginInteractive(_ call: CAPPluginCall) {
        // 1. Set Web View Parameters  for iOS or macos
        #if os(iOS)
        let webViewParameters = MSALWebviewParameters(authPresentationViewController: self.bridge.viewController)
        #else
        let webViewParameters = MSALWebviewParameters()
        #endif

        let parameters = MSALInteractiveTokenParameters(scopes: self.msalPopupScopes!, webviewParameters: webViewParameters)
        parameters.promptType = .default
        parameters.completionBlockQueue = DispatchQueue.main
        
        // 3. Acquire Token view Redirect Login through Microsft Identity Platform
        self.msalClient?.acquireToken(with: parameters) { (response, error) in
            if let error = error {
                call.error("InteractiveLogin Error: Unknown Error", error, [
                    "errorDescription": error.localizedDescription
                ])
                return
            }
            
            guard let response = response else {
                call.reject("InteractiveLogin Error: Could not acquire token: No result returned", nil, nil, [
                    "interactiveLogin": "No response was returned from MSAL Login"
                ])
                return
            }
            
            self.msalResults = response
            self.msalAccount = response.account
            self.msalAuthenticated = true
            self.resolveAuthenticationResults(call, response);
        }
    }
    
    private func loginSilently(_ account : MSALAccount!, _ call: CAPPluginCall) {
        let parameters = MSALSilentTokenParameters(scopes: self.msalPopupScopes!, account: account)
        self.msalClient?.acquireTokenSilent(with: parameters) { (response, error) in
            if let error = error {
                let error = error as NSError
                if (error.domain == MSALErrorDomain) {
                    if (error.code == MSALError.interactionRequired.rawValue) {
                        DispatchQueue.main.async {
                            self.loginInteractive(call)
                        }
                        return
                    }
                }
                call.reject("SilentLogin Error: Could not acquire token silently: \(error)")
                return
            }
            
            guard let response = response else {
                call.reject("SilentLogin Error: Could not acquire token: No result returned")
                return
            }
            
            self.msalResults = response
            self.msalAccount = response.account
            self.msalAuthenticated = true
            self.resolveAuthenticationResults(call, response)
        }
    }
    
    private func isBiometricAvaiable() -> Bool {
        do {
            var error: NSError?
            if self.msalLocalAuthContext.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
                return true
            } else {
                return false
            }
        } catch let error {
            return false
        }
    }

    private func resolveAuthenticationResults(_ call: CAPPluginCall, _ authResults: MSALResult!) {
        if (authResults != nil) {   
            call.resolve([
                "results" : [
                    "authority" : authResults.authority.url.absoluteString,
                    "uniqueId": authResults.tenantProfile.identifier,
                    "tenantId" : authResults.tenantProfile.tenantId ?? "" as String,
                    "accessToken" : authResults.accessToken,
                    "idToken" : authResults.idToken ?? "" as String,
                    "expiresOn": self.dateFormatter.string(from: authResults.expiresOn),
                    "account": [
                        "homeAccountId": authResults.account.homeAccountId?.identifier ?? "",
                        "tenantId": authResults.tenantProfile.tenantId,
                        "localAccountId":  authResults.account.identifier ?? "",
                        "username": authResults.account.username,
                        "idTokenClaims": authResults.account.accountClaims
                    ],
                    "idTokenClaims": [
                        authResults.tenantProfile.claims
                    ],
                    "scopes": authResults.scopes
                ]
            ])

        } else {
            call.resolve([
                "results": []
            ])
        }
    }
}
