#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>
#import <MSAL/MSAL.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(MsalCap, "MsalPlugin",
    CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(isBiometricsAvailable, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(canEvaluateBiometricsPolicy, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(evaluateBiometricsPolicy, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireAccountByUsername, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireCurrentAccount, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireAllAccounts, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireTokenSilently, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireTokenInteractively, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(login, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(logout, CAPPluginReturnPromise);
)