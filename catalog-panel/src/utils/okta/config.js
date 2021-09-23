let CLIENT_ID = '0oaxava41L95FME7I1d6';
let BASE_URL = 'https://cars24.oktapreview.com';
let REDIRECT_URI = `${window.location.origin}/implicit/callback`;
switch (process.env.REACT_APP_ENV) {
  case 'qa':
    CLIENT_ID = '0oaxava41L95FME7I1d6';
    BASE_URL = 'https://cars24.oktapreview.com';
    break;
  case 'staging':
    CLIENT_ID = '0oaxava41L95FME7I1d6';
    BASE_URL = 'https://cars24.oktapreview.com';
    break;
  case 'prod':
    CLIENT_ID = '0oa3prnqe81kJ0VK94x7';
    BASE_URL = 'https://cars24.okta.com';
    REDIRECT_URI = `https://catalog-panel.c24.tech/implicit/callback`;
    break;
  default:
    CLIENT_ID = '0oaxava41L95FME7I1d6';
    BASE_URL = 'https://cars24.oktapreview.com';
    break;
}

export default {
  oidc: {
    baseUrl: BASE_URL,
    clientId: CLIENT_ID,
    issuer: BASE_URL + '/oauth2/default',
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email', 'phone']
  }
};