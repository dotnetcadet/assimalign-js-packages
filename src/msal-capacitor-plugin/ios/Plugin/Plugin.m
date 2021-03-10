#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>
#import <MSAL/MSAL.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(MsalCap, "MsalCap",
    CAP_PLUGIN_METHOD(setOptions, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(logout, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(login, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(isAuthenticated, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireUserRoles, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireAccessTokenForUser, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(acquireAuthenticationResult, CAPPluginReturnPromise);
)
