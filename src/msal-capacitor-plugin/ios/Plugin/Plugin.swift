import Foundation
import Capacitor
import MSAL

@objc(MsalCap)
public class MsalPlugin: CAPPlugin {
    
    var account: MSALAccount?
    var authResults: MSALResult?
    var client: MSALPublicClientApplication?
    var authenticated = Bool()
    var popupScopes: [String]?
    var hasOptions = Bool()
    
    var dateFormatter = DateFormatter()
    var loggingText = String()
    

    // This will act as a constructor for initializing
    public override func load() {
        self.dateFormatter.dateFormat = "YY-MM-dd'T'HH:mm:ss"
    }
    

    @objc func setOptions(_ call: CAPPluginCall) {
        do {
            guard let authorityUri = call.getString("authority") else {
                return
            }
            guard let clientId = call.getString("clientId") else {
                return
            }
            guard let redirectUri  = call.getString("redirectUri") else {
                return
            }
            guard let authorityUrl = URL(string: authorityUri ) else {
                return
            }
            
            let clientAuthority = try MSALAADAuthority(url: authorityUrl)
            let clientConfiguration = MSALPublicClientApplicationConfig(clientId: clientId, redirectUri: redirectUri, authority: clientAuthority)
            
            self.client = try MSALPublicClientApplication(configuration: clientConfiguration)
            self.popupScopes = call.getArray("scopes", String.self)
            self.hasOptions = true
            self.authenticated = false
            call.resolve()
            
        } catch let error {
            call.error("", error, [
                "results": "Unable to set options"
            ])
        }
    }
    
    @objc func acquireAccessTokenForUser(_ call: CAPPluginCall) {
        if self.authenticated == true && self.authResults != nil && self.client != nil{

            let msalParameters = MSALParameters()
            msalParameters.completionBlockQueue = DispatchQueue.main
            
            self.client?.getCurrentAccount(with: msalParameters, completionBlock: { (currentAccount, previousAccount, error)  in
                if let currentAccount = currentAccount {
                    self.account = currentAccount
                }
            })
            
            guard let scopes = call.getArray("scopes", String.self) else {
                return
            }
            
            guard let account = self.account else {
                return
            }

            let parameters = MSALSilentTokenParameters(scopes: scopes, account: account)
            parameters.forceRefresh = true
            
            self.client?.acquireTokenSilent(with: parameters, completionBlock: { (response, error) in
                if let error = error {
                    call.error("Unable to Acquire Access Token", error, [
                        "unexpectedError": error.localizedDescription
                    ])
                    return
                }

                guard let response = response else {
                    call.reject("Could not acquire token: No result returned")
                    return
                }
                
                call.resolve([
                    "results": response.accessToken
                ])
            })
        } else {
            call.reject("User has not been Authenticated yet. Please Login first before calling this request")
        }
    }

    @objc func acquireUserRoles(_ call: CAPPluginCall) {
        if self.hasOptions == true && self.authenticated == true {
            guard let claims = self.account?.accountClaims else {
                call.resolve([
                    "results": []
                ])
                return
            }
            
            let roles = claims["roles"] as? [String]
            
            call.resolve([
                "results": roles
            ])
            
        } else {
            call.reject("Eiether Plugin Confgiuraitons have not been set or the user has not been authenticated")
        }
        
    }
    
    @objc func acquireAuthenticationResult(_ call: CAPPluginCall) {
        guard let response = self.authResults else {
            call.resolve([
                "results": []
            ])
            return
        }
        
        call.resolve([
            "results" : [
                "authority" : response.authority.url.absoluteString,
                "uniqueId": response.tenantProfile.identifier,
                "tenantId" : response.tenantProfile.tenantId ?? "" as String,
                "accessToken" : response.accessToken,
                "idToken" : response.idToken ?? "" as String,
                "expiresOn": self.dateFormatter.string(from: response.expiresOn),
                "account": [
                    "homeAccountId": response.account.homeAccountId?.identifier ?? "",
                    "tenantId": response.tenantProfile.tenantId,
                    "localAccountId":  response.account.identifier ?? "",
                    "username": response.account.username,
                    "idTokenClaims": response.account.accountClaims
                ],
                "idTokenClaims": [
                    response.tenantProfile.claims
                ],
                "scopes": response.scopes
            ]
        ])
    }
        
    @objc func isAuthenticated(_ call: CAPPluginCall) {
        call.resolve([
            "results": self.authenticated
        ])
    }
     
    @objc func login(_ call: CAPPluginCall)  {
        if self.hasOptions == false {
            call.reject("Options have not been set")
            return
        }
        
        DispatchQueue.main.async {
            self.loadAccount {(account) in
                guard let currentAccount = self.account else {
                    self.loginInteractive(call)
                    return
                }
                self.loginSilently(currentAccount, call)
            }
        }
    }
    
    @objc func logout(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.logoutInteractive(call)
        }
    }
    
    
    typealias AccountCompletion = (MSALAccount?) -> Void

    
    // This will check to see if there are any avaiable accounts already cached on the device
    // If any account is found it will load it and try to up
    func loadAccount(completion: AccountCompletion? = nil) {
        let msalParameters = MSALParameters()
        msalParameters.completionBlockQueue = DispatchQueue.main
                
        self.client?.getCurrentAccount(with: msalParameters, completionBlock: { (currentAccount, previousAccount, error) in
            if let error = error {
                return
            }
            
            if let currentAccount = currentAccount {
                self.account = currentAccount
                if let completion = completion {
                    completion(self.account)
                }
                return
            }
            
            self.account = nil
  
            if let completion = completion {
                completion(nil)
            }
        })
    }
    
    
    private func logoutInteractive(_ call: CAPPluginCall) {
        guard let applicationContext = self.client else {
            call.resolve()
            return
        }
        guard let currentAccount = self.account else {
            call.resolve()
            return
        }
        
        do {
            
            let webViewParameters = MSALWebviewParameters(authPresentationViewController: self.bridge.viewController)
            let signoutParameters = MSALSignoutParameters(webviewParameters: webViewParameters)
            
            signoutParameters.signoutFromBrowser = true
            applicationContext.signout(with: currentAccount, signoutParameters: signoutParameters, completionBlock: {(success, error) in
                if let error = error {
                    call.error("Unable to signout", error, [
                        "unexpectedError": error.localizedDescription
                    ])
                    return
                }
                
                self.account = nil
                self.authResults = nil
                self.authenticated = false
                call.resolve()
            })
        }
    }
    

    
    private func loginInteractive(_ call: CAPPluginCall) {
        
        if self.hasOptions == true {
            
            let webViewParameters = MSALWebviewParameters(authPresentationViewController: self.bridge.viewController)
            let parameters = MSALInteractiveTokenParameters(scopes: self.popupScopes!, webviewParameters: webViewParameters)
            
            parameters.promptType = .selectAccount
            
            self.client?.acquireToken(with: parameters) { (response, error) in
                if let error = error {
                    call.error("Unknown Error", error, [
                        "errorDescription": error.localizedDescription
                    ])
                    return
                }
                
                guard let response = response else {
                    call.reject("Could not acquire token: No result returned", nil, nil, [
                        "interactiveLogin": "No response was returned from MSAL Login"
                    ])
                    return
                }
                
                self.authResults = response
                self.account = response.account
                self.authenticated = true
                
                call.resolve([
                    "results" : [
                        "authority" : response.authority.url.absoluteString,
                        "uniqueId": response.tenantProfile.identifier,
                        "tenantId" : response.tenantProfile.tenantId ?? "" as String,
                        "accessToken" : response.accessToken,
                        "idToken" : response.idToken ?? "" as String,
                        "expiresOn": self.dateFormatter.string(from: response.expiresOn),
                        "account": [
                            "homeAccountId": response.account.homeAccountId?.identifier ?? "",
                            "tenantId": response.tenantProfile.tenantId,
                            "localAccountId":  response.account.identifier ?? "",
                            "username": response.account.username,
                            "idTokenClaims": response.account.accountClaims
                        ],
                        "idTokenClaims": [
                            response.tenantProfile.claims
                        ],
                        "scopes": response.scopes
                    ]
                ])
            }
        } else {
            call.reject("Options have not been set")
        }
    }
    
    func loginSilently(_ account : MSALAccount!, _ call: CAPPluginCall) {
        guard let applicationContext = self.client else { return }
        let parameters = MSALSilentTokenParameters(scopes: self.popupScopes ?? [], account: account)
        applicationContext.acquireTokenSilent(with: parameters) { (response, error) in
            if let error = error {
                let nsError = error as NSError
                if (nsError.domain == MSALErrorDomain) {
                    if (nsError.code == MSALError.interactionRequired.rawValue) {
                        DispatchQueue.main.async {
                            self.loginInteractive(call)
                        }
                        return
                    }
                }
                call.reject("Could not acquire token silently: \(error)")
                return
            }
            
            guard let response = response else {
                call.reject("Could not acquire token: No result returned")
                return
            }
            
            self.authResults = response
            self.account = response.account
            self.authenticated = true
            
            call.resolve([
                "results" : [
                    "authority" : response.authority.url.absoluteString,
                    "uniqueId": response.tenantProfile.identifier,
                    "tenantId" : response.tenantProfile.tenantId ?? "" as String,
                    "accessToken" : response.accessToken,
                    "idToken" : response.idToken ?? "" as String,
                    "expiresOn": self.dateFormatter.string(from: response.expiresOn),
                    "account": [
                        "homeAccountId": response.account.homeAccountId?.identifier ?? "",
                        "tenantId": response.tenantProfile.tenantId,
                        "localAccountId":  response.account.identifier ?? "",
                        "username": response.account.username,
                        "idTokenClaims": response.account.accountClaims
                    ],
                    "idTokenClaims": [
                        response.tenantProfile.claims
                    ],
                    "scopes": response.scopes
                ]
            ])
        }
    }

    
    func updateLogging(text : String) {
        if Thread.isMainThread {
            self.loggingText = text
        } else {
            DispatchQueue.main.async {
                self.loggingText = text
            }
        }
    }
}