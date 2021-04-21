import { useContext, useState, useEffect } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import { AuthContext } from '../context/auth';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItemDivider, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList, IonItem, IonLabel } from '@ionic/react';
import './Home.css';
import { AuthenticationResult } from '@azure/msal-common';



interface IRoles {
  key: string;
  values: string[];

}

const Home: React.FC = () => {

  const { acquireAccessTokenForUser, acquireAuthenticationResult } = useContext(AuthContext);
  const [ authenticationResults, setAuthenticationResults] = useState<AuthenticationResult>();
  const [ accessToken, setAccessToken] = useState<string>("");

  useEffect(()=>{
    handleAuthResults();
  },[])

  const handleAuthResults = async() =>{
    try {
      let results = await acquireAuthenticationResult();

      if(results) {
        setAuthenticationResults(results as AuthenticationResult);
        console.log(results);
      }
    }
    catch(error) {
      console.log(error);
    }
  }
  const handleAccessToken = async() => {
    try {
      let token = await acquireAccessTokenForUser([
        'https://func-auth-a.azurewebsites.net/user_impersonation'
      ]);

      

      if(token){
        setAccessToken(token as string);
        console.log(token);
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  const getProperty = <T, K extends keyof T>(o?: T, propertyName?: K): T[K] => {

   if(authenticationResults?.idTokenClaims) {
     let t = authenticationResults.idTokenClaims as IRoles
   }

    if(o && propertyName) {
      return o[propertyName];
    } else {
      throw Error
    }
     // o[propertyName] is of type T[K]
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Auth Results</IonCardTitle>
            <IonCardSubtitle class="ion-text-nowrap">Tenant: {authenticationResults?.tenantId}</IonCardSubtitle>
            <IonCardSubtitle class="ion-text-nowrap">Unique Id: {authenticationResults?.uniqueId}</IonCardSubtitle>
            <IonCardSubtitle class="ion-text-nowrap">Username: {authenticationResults?.account?.username}</IonCardSubtitle>
            {/* <IonCardSubtitle>{authenticationResults.}</IonCardSubtitle> */}
          </IonCardHeader>
          <IonCardContent>
            <IonList>

              <IonItem>
                <IonLabel>{ (Object.entries(authenticationResults?.idTokenClaims ?? {}).filter(([x,y]) => x === "roles",)) }</IonLabel>
              </IonItem>
              
              {
                Object.entries(authenticationResults?.account?.idTokenClaims ?? {}).map(([key,value])=> {
                  if(typeof(value)=== typeof(Object)) {
                    Object.entries(value).map(([key,value])=>{
                      return (
                        <IonItem>
                          <IonLabel>{typeof(value)}: {key} - {value}</IonLabel>
                        </IonItem>
                      )
                    })
                  } else {
                    return (
                      <IonItem>
                        <IonLabel>{typeof(value)}: {key} - {value}</IonLabel>
                      </IonItem>
                    )
                  }
                })
              }
            </IonList>

          </IonCardContent>
        </IonCard>
        <div>
          <p>{authenticationResults?.account?.username}</p>
          <IonItemDivider/>
          <IonButton onClick={handleAccessToken} expand="block">Get Token</IonButton>
          <IonItemDivider/>
          <p><small>{accessToken}</small></p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
