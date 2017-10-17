import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

// Front pages
import Home from 'pages/Home'
import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import SignUpWithFacebook from 'pages/SignUpWithFacebook'
import SignUpVerification from 'pages/SignUpVerification'
import AccountSettings from 'pages/AccountSettings'

// Admin pages
import AdminIndex from 'pages/AdminIndex'

// Auth wrappers
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
  userIsAdmin,
} from './auth-wrapper'


const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/signin" component={userIsNotAuthenticated(SignIn)} />
      <Route exact path="/signup" component={userIsNotAuthenticated(SignUp)} />
      <Route exact path="/signup-with-facebook/:access_token" component={userIsNotAuthenticated(SignUpWithFacebook)} />
      <Route exact path="/verify-account/:token" component={SignUpVerification} />
      <Route exact path="/account-settings" component={userIsAuthenticated(AccountSettings)} />

      <Route exact path="/admin">
        <Route exact path="" component={userIsAdmin(AdminIndex)} />
      </Route>
    </div>
  </ConnectedRouter>
)

export default Routes
