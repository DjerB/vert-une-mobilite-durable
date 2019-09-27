
import React, { Component } from 'react';
import { withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../components/spinner';
import { addToLocalStorage } from '../utils/localStorage';

const DOMAIN = "vertunemobilitedurable";
const REGION = "eu-central-1";
const RESPONSE_TYPE = "token";
const CLIENT_ID = "74jqhkon51fhqcij088pashkgu";
const REDIRECT_URI = "https://vertunemobilitedurable.fr/onboarding";

//  The id token is sent by Okta as a jwt token so decryption is needed
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

const OktaAuthComponent = withRouter(class OktaAuth extends Component {
  constructor(props) {
    super(props);
    const userString = localStorage.getItem("VMD_USER");
    this.state = {
      user: userString ? JSON.parse(userString) : null,
      isAuthenticated: userString ? true : false,
      loading: false
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
  }

  async login() {
    window.location.href = `https://${DOMAIN}.auth.${REGION}.amazoncognito.com/login?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  }

  logout(){
    window.location.href = `https://${DOMAIN}.auth.${REGION}.amazoncognito.com/logout?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  }

  getIdToken() {
    let user = {};
    console.log(this.props);
    let hash = null;
    try {
      hash = this.props.history.location.hash;

      const idToken = hash.split("id_token=")[1].split("&")[0];
      const decodedJWT = parseJwt(idToken);
      console.log(decodedJWT);
      user.gaiaId = decodedJWT.identities[0].userId;//"claireGaiaId";
      user.nom = decodedJWT.family_name;
      user.prenom = decodedJWT.given_name;

      this.setState({ user, isAuthenticated: true });

      addToLocalStorage("VMD_USER", JSON.stringify(user));

      const userAction = { type: "UPDATE_USER", value: {} };
      this.props.dispatch(userAction);
      return user;
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  render() {
    console.log(this.state);
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { passedProps: this.state, login: this.login, getIdToken: this.getIdToken, logout: this.logout }));
    return this.state.loading ? <Spinner /> : <Switch>{childrenWithProps}</Switch>;
  }
});

const mapStateToProps = state => {
  return {
    reducedUser: state.reducedUser
  }
};

export default connect(mapStateToProps)(OktaAuthComponent);