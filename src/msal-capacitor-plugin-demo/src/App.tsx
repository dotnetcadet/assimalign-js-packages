import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useAuthentication, AuthContext } from './context/auth';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import { useEffect, useState } from 'react';

const App: React.FC = () => {

  const authProvider = useAuthentication();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(()=>{
    handleLogin();
  },[])

  const handleLogin = async() => {
    try {
      let results = await authProvider.login();
      if(results) {
        let authenticated = await authProvider.isAuthenticated() as boolean;
        setIsAuthenticated(authenticated);
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  if(isAuthenticated) {
    return (
      <AuthContext.Provider value={authProvider}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </AuthContext.Provider>
    );
  } else {
    return (
      <>
      </>
    )
  }
}

export default App;