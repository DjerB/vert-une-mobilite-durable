import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Provider } from "react-redux";
import Store from "./store/configureStore";
import OktaAuthComponent from './auth/Auth';

import * as ROUTES from './constants/routes';

import Container from './components/container';
import UserBar from './components/userBar';
import BigUserBar from './components/bigUserBar';
import LandingView from './views/Landing';
import OnboardingView from './views/Onboarding';
import NavigationView from './views/Navigation';
import NewsfeedView from './views/Newsfeed';
import ChallengesView from './views/Challenges';
import ChallengeView from './views/Challenge';
import QCMView from './views/QCM';
import SocialView from './views/Social';
import RankingView from './views/Ranking';
import ProfileView from './views/Profile';

const App = () => (
    <div id="app">
        <Provider store={Store}>
            <OktaAuthComponent>
                <CustomRoute exact path={ROUTES.LANDING} component={LandingView} />
                <CustomRoute path={ROUTES.ON_BOARDING} component={OnboardingView} />
                <BigHeaderSecureRoute exact path={ROUTES.NEWSFEED} component={NewsfeedView} />        
                <BigHeaderSecureRoute exact path={ROUTES.PROFILE} component={ProfileView} />
                <HeaderSecureRoute exact path={ROUTES.CHALLENGES} component={ChallengesView} />
                <HeaderSecureRoute exact path={ROUTES.CHALLENGE} component={ChallengeView} />
                <HeaderSecureRoute path={ROUTES.SENSIBILISATION} component={QCMView} />
                <HeaderSecureRoute exact path={ROUTES.SOCIAL} component={SocialView} />
                <HeaderFreeSecureRoute path={ROUTES.GAZIER} component={ProfileView} />
                <HeaderSecureRoute exact path={ROUTES.RANKING} component={RankingView} />
                <Route component={NotFoundRedirect} />
            </OktaAuthComponent>
        </Provider>
    </div>
);

const NotFoundRedirect = () => <Redirect to='/' />

const CustomRoute = ({ component: Component, passedProps, login, getIdToken, ...rest }) => (
    <Route {...rest} render={(props) => (
        <Component {...props} {...passedProps} login={login} getIdToken={getIdToken} />
    )} />
);

const HeaderFreeSecureRoute = ({ component: Component, passedProps, ...rest }) => {
    console.log(passedProps);
    if (!passedProps.user) {
        return <Redirect to={ROUTES.LANDING} />;
    }
    return (
    <Route {...rest} render={(props) => (
        <Fragment>
            <Container>
                <Component {...props} {...passedProps} />
            </Container>
            <NavigationView />
        </Fragment>
    )} />);
};

const HeaderSecureRoute = ({ component: Component, passedProps, ...rest }) => {
    if (!passedProps.user) {
        return <Redirect to={ROUTES.LANDING} />;
    }
    return (
    <Route {...rest} render={(props) => (
        <Fragment>
            <Container>
                <UserBar {...passedProps} />
                <Component {...props} {...passedProps} />
            </Container>
            <NavigationView />
        </Fragment>
    )} />);
};

const BigHeaderSecureRoute = ({ component: Component, passedProps, logout, ...rest }) => {
    if (!passedProps.user) {
        return <Redirect to={ROUTES.LANDING} />;
    }
    return (
    <Route {...rest} render={(props) => (
        <Fragment>
            <Container>
                <BigUserBar {...passedProps} />
                <Component {...props} {...passedProps} logout={logout} />
            </Container>
            <NavigationView />
        </Fragment>
    )} />);
};

export default App;