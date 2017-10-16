import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Home from 'pages/Home'
import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import SignUpWithFacebook from 'pages/SignUpWithFacebook'
import SignUpVerification from 'pages/SignUpVerification'

import {
  userIsNotAuthenticated, 
} from './auth-wrapper'


const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Route exact path="/signin" component={userIsNotAuthenticated(SignIn)} />
      <Route exact path="/signup" component={userIsNotAuthenticated(SignUp)} />
      <Route exact path="/signup-with-facebook/:access_token" component={userIsNotAuthenticated(SignUpWithFacebook)} />
      <Route exact path="/verify-account/:token" component={SignUpVerification} />
      <Route exact path="/" component={Home} />
    </div>
  </ConnectedRouter>
)

export default Routes
