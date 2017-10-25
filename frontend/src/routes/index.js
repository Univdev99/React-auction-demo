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
import AdminAuthenticating from 'pages/AdminAuthenticating'
import AdminIndex from 'pages/AdminIndex'
import AdminCharityList from 'pages/AdminCharityList'
import AdminCharityCreate from 'pages/AdminCharityCreate'
import AdminCharityDetail from 'pages/AdminCharityDetail'
import AdminDonorList from 'pages/AdminDonorList'
import AdminDonorCreate from 'pages/AdminDonorCreate'
import AdminDonorDetail from 'pages/AdminDonorDetail'
import AdminDonorProductList from 'pages/AdminDonorProductList'
import AdminProductList from 'pages/AdminProductList'
import AdminProductCreate from 'pages/AdminProductCreate'
import AdminProductDetail from 'pages/AdminProductDetail'

// Auth wrappers
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
  userIsAdmin,
} from './auth-wrapper'


const AdminRoutes = props => (
  <div>
    <Route exact path="/admin" component={AdminIndex} />
    <Route exact path="/admin/charities" component={AdminCharityList} />
    <Route exact path="/admin/charities/create" component={AdminCharityCreate} />
    <Route exact path="/admin/charities/:id(\d+)" component={AdminCharityDetail} />
    <Route exact path="/admin/donors" component={AdminDonorList} />
    <Route exact path="/admin/donors/create" component={AdminDonorCreate} />
    <Route exact path="/admin/donors/:id(\d+)" component={AdminDonorDetail} />
    <Route exact path="/admin/donors/:id(\d+)/products" component={AdminDonorProductList} />
    <Route exact path="/admin/products" component={AdminProductList} />
    <Route exact path="/admin/products/create" component={AdminProductCreate} />
    <Route exact path="/admin/products/:id(\d+)" component={AdminProductDetail} />
  </div>
)

const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/signin" component={userIsNotAuthenticated(SignIn)} />
      <Route exact path="/signup" component={userIsNotAuthenticated(SignUp)} />
      <Route exact path="/signup-with-facebook/:access_token" component={userIsNotAuthenticated(SignUpWithFacebook)} />
      <Route exact path="/verify-account/:token" component={SignUpVerification} />
      <Route exact path="/account-settings" component={userIsAuthenticated(AccountSettings)} />

      <Route exact path="/admin/authenticating" component={userIsAuthenticated(AdminAuthenticating)} />
      <Route path="/admin" component={userIsAdmin(AdminRoutes)} />
    </div>
  </ConnectedRouter>
)

export default Routes
