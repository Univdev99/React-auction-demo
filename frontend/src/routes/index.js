import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

// Front pages
import Home from 'pages/Home'
import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import SignUpWithFacebook from 'pages/SignUpWithFacebook'
import SignUpVerification from 'pages/SignUpVerification'

import AccountBids from 'pages/AccountBids'
import AccountInfo from 'pages/AccountInfo'
import AccountPassword from 'pages/AccountPassword'
import AccountPaymentInfo from 'pages/AccountPaymentInfo'
import AccountWins from 'pages/AccountWins'
import AuctionDetail from 'pages/AuctionDetail'
import Auctions from 'pages/Auctions'
import Careers from 'pages/Careers'
import Donors from 'pages/Donors'
import DonorDetail from 'pages/DonorDetail'
import Faqs from 'pages/Faqs'
import JobDetail from 'pages/JobDetail'
import PrivacyPolicy from 'pages/PrivacyPolicy'
import Shipping from 'pages/Shipping'
import Support from 'pages/Support'
import TermsConditions from 'pages/TermsConditions'

// Admin pages
import AdminLayout from 'pages/AdminLayout'
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
import AdminAuctionList from 'pages/AdminAuctionList'
import AdminAuctionCreate from 'pages/AdminAuctionCreate'
import AdminAuctionDetail from 'pages/AdminAuctionDetail'
import AdminAuctionStart from 'pages/AdminAuctionStart'
import AdminAuctionBidList from 'pages/AdminAuctionBidList'
import AdminUserList from 'pages/AdminUserList'
import AdminMediumList from 'pages/AdminMediumList'

// Managers (currently implemented as invisible page components)
import RealTimeNotificationManager from 'managers/RealTimeNotificationManager'

// Modals
import SignInModal from 'components/SignInModal'

// Auth wrappers
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
  currentUserNotLoadedForAdmin,
  userIsAdmin,
} from './auth-wrapper'


// Layout components
import AccountLayout from 'components/AccountLayout'


const AdminRoutes = props => (
  <AdminLayout>
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
    <Route exact path="/admin/auctions" component={AdminAuctionList} />
    <Route exact path="/admin/auctions/create" component={AdminAuctionCreate} />
    <Route exact path="/admin/auctions/:id(\d+)" component={AdminAuctionDetail} />
    <Route exact path="/admin/auctions/:id(\d+)/start" component={AdminAuctionStart} />
    <Route exact path="/admin/auctions/:id(\d+)/bids" component={AdminAuctionBidList} />
    <Route exact path="/admin/users" component={AdminUserList} />
    <Route exact path="/admin/media" component={AdminMediumList} />
  </AdminLayout>
)

const AccountRoutes = props => (
  <AccountLayout>
    <Route exact path="/account" component={() => <Redirect to="/account/bids" />} />
    <Route exact path="/account/bids" component={AccountBids} />
    <Route exact path="/account/wins" component={AccountWins} />
    <Route exact path="/account/info" component={AccountInfo} />
    <Route exact path="/account/payment-info" component={AccountPaymentInfo} />
    <Route exact path="/account/change-password" component={AccountPassword} />
  </AccountLayout>
)

const modals = (
  <div>
    <SignInModal />
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

      <Route exact path="/auctions" component={Auctions} />
      <Route exact path="/auctions/:id" component={AuctionDetail} />

      <Route exact path="/donors" component={Donors} />
      <Route exact path="/donors/:id" component={DonorDetail} />

      <Route exact path="/admin-authenticating" component={userIsAuthenticated(currentUserNotLoadedForAdmin(AdminAuthenticating))} />
      <Route path="/admin" component={userIsAdmin(AdminRoutes)} />

      <Route path="/account/:slug?" component={userIsAuthenticated(AccountRoutes)} />

      <Route exact path="/careers" component={Careers} />
      <Route exact path="/faqs" component={Faqs} />
      <Route exact path="/jobs/:id" component={JobDetail} />
      <Route exact path="/privacy-policy" component={PrivacyPolicy} />
      <Route exact path="/shipping" component={Shipping} />
      <Route exact path="/support" component={Support} />
      <Route exact path="/terms-conditions" component={TermsConditions} />

      <Route path="/" component={RealTimeNotificationManager} />

      {modals}
    </div>
  </ConnectedRouter>
)

export default Routes
