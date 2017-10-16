import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  AUTH_SIGNIN,
  AUTH_SIGNOUT,
  AUTH_SIGNUP,
  AUTH_SIGNUP_WITH_FACEBOOK,
  AUTH_VERIFY_SIGNUP,
  AUTH_VERIFY_SIGNUP_RESET,
  AUTH_CURRENT_USER,
} from 'store/constants'

import { loadData, saveData } from 'utils/storage'


/* Constants */

export const SIGNUP_VERIFICATION_IN_PROGRESS = 0
export const SIGNUP_VERIFICATION_SUCCESSFUL = 1
export const SIGNUP_VERIFICATION_FAILED = -1

/* Initial state */

function getInitialState() {
  const { token } = loadData()
  return {
    // current user info
    username: '',
    email: '',
    userLoaded: false,
    isStaff: false,
    // sign in
    signingIn: false,
    signedIn: !!token,
    signInError: false,
    // sign up
    signingUp: false,
    signUpError: false,
    // sign up with facebook
    signingUpWithFacebook: false,
    signUpWithFacebookError: false,
    /*
     * sign up verification status:
     *   0: in progress, 1: successful, -1: failed,
     */
    signUpVerificationStatus: SIGNUP_VERIFICATION_IN_PROGRESS,
  }
}
const initialState = Immutable.Map(getInitialState())

/* Action creators */

export const signIn = createAction(AUTH_SIGNIN)
export const signOut = createAction(AUTH_SIGNOUT)
export const getCurrentUser = createAction(AUTH_CURRENT_USER)
export const signUp = createAction(AUTH_SIGNUP)
export const signUpWithFacebook = createAction(AUTH_SIGNUP_WITH_FACEBOOK)
export const verifySignUp = createAction(AUTH_VERIFY_SIGNUP)
export const resetSignUpVerification = createAction(AUTH_VERIFY_SIGNUP_RESET)

/* Reducer */

export default handleActions({
  // Sign in actions
  [requestSuccess(AUTH_SIGNIN)]: (state, { payload }) => state.withMutations(map => {
    const { token } = payload
    saveData({ token })
    map.set('signedIn', true)
    map.set('signInError', false)
  }),
  [requestFail(AUTH_SIGNIN)]: (state, { payload }) => state.withMutations(map => {
    map.set('signedIn', false)
    map.set('signInError', true)
  }),
  // Get current user actions
  [requestSuccess(AUTH_CURRENT_USER)]: (state, { payload }) => state.withMutations(map => {
    const { username, email, is_staff } = payload
    map.set('username', username)
    map.set('email', email)
    map.set('isStaff', !!is_staff)
    map.set('userLoaded', true)
  }),
  [requestFail(AUTH_CURRENT_USER)]: (state, { payload }) => state.withMutations(map => {
    map.set('username', '')
    map.set('email', '')
    map.set('isStaff', false)
    map.set('userLoaded', false)
  }),
  // Sign out actions
  [AUTH_SIGNOUT]: (state) => state.withMutations(map => {
    map.set('username', '')
    map.set('email', '')
    map.set('isStaff', false)
    map.set('signedIn', false)
    map.set('signInError', false)
    map.set('userLoaded', false)
    saveData({ token: '' })
  }),
  // Sign up actions
  [AUTH_SIGNUP]: (state, { payload }) => state.withMutations(map => {
    map.set('signingUp', true)
    map.set('signUpError', false)
  }),
  [requestSuccess(AUTH_SIGNUP)]: (state, { payload }) => state.withMutations(map => {
    map.set('signingUp', false)
    map.set('signUpError', false)
  }),
  [requestFail(AUTH_SIGNUP)]: (state, { payload }) => state.withMutations(map => {
    map.set('signingUp', false)
    map.set('signUpError', true)
  }),
  // Sign up with facebook actions
  [AUTH_SIGNUP_WITH_FACEBOOK]: (state, { payload }) => state.withMutations(map => {
    map.set('signingUpWithFacebook', true)
    map.set('signUpWithFacebookError', false)
  }),
  [requestSuccess(AUTH_SIGNUP_WITH_FACEBOOK)]: (state, { payload }) => state.withMutations(map => {
    map.set('signingUpWithFacebook', false)
    map.set('signUpWithFacebookError', false)
  }),
  [requestFail(AUTH_SIGNUP_WITH_FACEBOOK)]: (state, { payload }) => state.withMutations(map => {
    map.set('signingUpWithFacebook', false)
    map.set('signUpWithFacebookError', true)
  }),
  // Sign up verification actions
  [AUTH_VERIFY_SIGNUP]: (state, { payload }) => state.withMutations(map => {
    map.set('signUpVerificationStatus', SIGNUP_VERIFICATION_IN_PROGRESS)
  }),
  [requestSuccess(AUTH_VERIFY_SIGNUP)]: (state, { payload }) => state.withMutations(map => {
    map.set('signUpVerificationStatus', SIGNUP_VERIFICATION_SUCCESSFUL)
  }),
  [requestFail(AUTH_VERIFY_SIGNUP)]: (state, { payload }) => state.withMutations(map => {
    map.set('signUpVerificationStatus', SIGNUP_VERIFICATION_FAILED)
  }),
  [AUTH_VERIFY_SIGNUP_RESET]: (state, { payload }) => state.withMutations(map => {
    map.set('signUpVerificationStatus', SIGNUP_VERIFICATION_IN_PROGRESS)
  }),
}, initialState)
