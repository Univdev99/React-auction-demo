import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import { authSelector, isAuthenticatedSelector } from 'store/selectors'

const locationHelper = locationHelperBuilder({})

export const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/signin',
  authenticatedSelector: isAuthenticatedSelector,
  wrapperDisplayName: 'UserIsAuthenticated'
})

export const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  authenticatedSelector: state => !isAuthenticatedSelector(state),
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

export const currentUserNotLoadedForAdmin = connectedRouterRedirect({
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/admin',
  authenticatedSelector: state => !state.getIn(['auth', 'currentUser']),
  allowRedirectBack: false,
  wrapperDisplayName: 'currentUserNotLoadedForAdmin'
})

export const userIsAdmin = connectedRouterRedirect({
  redirectPath: '/admin-authenticating',
  authenticatedSelector: state => {
    const auth = authSelector(state)
    return auth.get('signedIn') && auth.getIn(['currentUser', 'is_staff'])
  },
  wrapperDisplayName: 'UserIsAdmin'
})
