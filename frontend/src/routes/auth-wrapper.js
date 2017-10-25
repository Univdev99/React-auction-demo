import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'


const locationHelper = locationHelperBuilder({})

export const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/signin',
  authenticatedSelector: state => !!state.getIn(['auth', 'signedIn']),
  wrapperDisplayName: 'UserIsAuthenticated'
})

export const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => 
    locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  authenticatedSelector: state => !state.getIn(['auth', 'signedIn']),
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

export const userIsAdmin = connectedRouterRedirect({
  redirectPath: '/admin/authenticating',
  authenticatedSelector: state => {
    const auth = state.get('auth')
    return auth.get('signedIn') && auth.getIn(['currentUser', 'is_staff'])
  },
  wrapperDisplayName: 'UserIsAdmin'
})
