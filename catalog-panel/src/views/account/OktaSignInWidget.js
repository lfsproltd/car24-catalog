import React, { Component } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import config from './../../utils/okta/config';

export default class OktaSignInWidget extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  componentDidMount() {
    this.widget = new OktaSignIn({
      baseUrl: config.oidc.baseUrl,
      clientId: config.oidc.clientId,
      issuer: config.oidc.issuer,
      redirectUri: config.oidc.redirectUri,
      scopes: config.oidc.scopes,
      idpDisplay: "PRIMARY",
      idps:[{
        type: "GOOGLE",
        id: process.env.REACT_APP_ENV && process.env.REACT_APP_ENV == 'prod' ? "0oa3qxdo2vJhZIuBC4x7" : "0oazt2wwffBKWHn5T1d6" 
      }]
    });
    this.widget.renderEl({el: this.wrapper.current}, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div ref={this.wrapper} />;
  }
};
