import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Home from 'pages/Home'
import SignIn from 'pages/SignIn'

const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={SignIn} />
    </div>
  </ConnectedRouter>
)

export default Routes
