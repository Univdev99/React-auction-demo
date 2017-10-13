import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Home from 'pages/Home'
import SignIn from 'pages/SignIn'

import {
  userIsAuthenticated,
  userIsNotAuthenticated, 
} from './auth-wrapper'


const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Route exact path="/signin" component={userIsNotAuthenticated(SignIn)} />
      <Route exact path="/"component={userIsAuthenticated(Home)} />
    </div>
  </ConnectedRouter>
)

export default Routes
