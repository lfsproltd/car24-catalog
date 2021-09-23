import React, { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import OktaSignInWidget from './OktaSignInWidget';

const AccountComponent = () => {

  const historyLink = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userRole, setUserRole] = useState([]);

  useEffect(()=>{
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let userRoles;
    if(user){
       userRoles = user.accessToken && user.accessToken.claims && user.accessToken.claims.locations && user.accessToken.claims.groups;
    }
    setUserRole(userRoles);
  },[])

  useEffect(() => {
    if (authState.isAuthenticated) {
      oktaAuth.getUser().then((info) => {
        localStorage.setItem("userData", JSON.stringify(info));
        if (localStorage.getItem("okta-token-storage")) {
          let userClaims = JSON.parse(localStorage.getItem("okta-token-storage"));
          if (userClaims && userClaims.accessToken && userClaims.accessToken.claims) {
            if (userClaims.accessToken.claims.country && userClaims.accessToken.claims.country.length && userClaims.accessToken.claims.vehicleType && userClaims.accessToken.claims.vehicleType.length) {
              let country = '';
              if (userClaims.accessToken.claims.country && userClaims.accessToken.claims.country.length) {
                country = localStorage.getItem("country");
                if (!country) {
                    country = userClaims.accessToken.claims.country[0];
                    localStorage.setItem("country", country);
                }
              }
              let vehicleType = '';
              if (userClaims.accessToken.claims.vehicleType && userClaims.accessToken.claims.vehicleType.length) {
                vehicleType = localStorage.getItem("vehicleType");
                if (!vehicleType) {
                    vehicleType = userClaims.accessToken.claims.vehicleType[0];
                    localStorage.setItem("vehicleType", vehicleType);
                }
              }
              if(userClaims.accessToken.claims && userClaims.accessToken.claims.groups){
                let roles = userClaims.accessToken.claims.groups;
                if(roles && roles.includes("CATALOG_QA")){
                  historyLink.push({pathname: '/workshop-qa', state: {
                    userClaims: userClaims && userClaims.accessToken && userClaims.accessToken.claims,
                    country: country,
                    vehicleType: vehicleType
                  }});
                }
                else if(roles && roles.includes("CATALOG_WSM") || roles.includes("CATALOG_TECH")){
                  historyLink.push({pathname: '/estimate', state: {
                    userClaims: userClaims && userClaims.accessToken && userClaims.accessToken.claims,
                    country: country,
                    vehicleType: vehicleType
                  }});
                }
                else{
                  historyLink.push('/unauthorized');
                }
              }else{
                historyLink.push('/unauthorized');
              }
            }
            else{
              historyLink.push('/unauthorized');
            }
          } else {
            historyLink.push('/unauthorized');
          }
        } else {
          historyLink.push('/unauthorized');
        }
      });
    }
  }, [authState, oktaAuth]);


  const onSuccess = function (res) {
    if (res.status === 'SUCCESS') {
      return oktaAuth.signInWithRedirect();
    }
  }

  const onError = function (err) {
    console.log('error logging in', err);
  }

  return (
    authState.isAuthenticated ?
      <Redirect to={{ pathname: '/' }} /> : <OktaSignInWidget onSuccess={onSuccess} onError={onError} />
  )
}

export default AccountComponent;