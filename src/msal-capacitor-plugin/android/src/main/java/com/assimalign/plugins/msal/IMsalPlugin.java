package com.assimalign.plugins.msal;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.microsoft.identity.client.AuthenticationCallback; // Imports MSAL auth methods
import com.microsoft.identity.client.*;
import com.microsoft.identity.client.exception.*;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import com.google.gson.JsonObject;
import com.microsoft.graph.authentication.IAuthenticationProvider; //Imports the Graph sdk Auth interface
import com.microsoft.graph.concurrency.ICallback;
import com.microsoft.graph.core.ClientException;
import com.microsoft.graph.http.IHttpRequest;
import com.microsoft.graph.models.extensions.*;
import com.microsoft.graph.requests.extensions.GraphServiceClient;
import com.microsoft.identity.client.AuthenticationCallback; // Imports MSAL auth methods

@NativePlugin
public class IMsalPlugin extends Plugin {


    public boolean msalHasOptions;
    public boolean msalIsAuthenticated;
    public Account msalAccount;
    public PublicClientApplication msalClient;



    @PluginMethod
    public void setOptions(PluginCall call) {

        String t = call.getString("clientId");


    }



    @PluginMethod
    public void login(PluginCall call) {
        try {
            AcquireTokenParameters tokenParams = new AcquireTokenParameters();

        }
        catch (Exception exception) {

        }
    }


}
