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
  AUTH_CURRENT_USER_UPDATE,
} from 'store/constants'

import { loadData, saveData } from 'utils/storage'


/* Initial state */

function getInitialState() {
  const { token } = loadData()
  return {
    // current user info
    currentUser: null,
    userLoaded: false,
    // sign in
    signedIn: !!token,
  }
}
const initialState = Immutable.fromJS(getInitialState())

/* Action creators */

export const signIn = createAction(AUTH_SIGNIN)
export const signOut = createAction(AUTH_SIGNOUT)
export const getCurrentUser = createAction(AUTH_CURRENT_USER)
export const updateCurrentUser = createAction(AUTH_CURRENT_USER_UPDATE)
export const signUp = createAction(AUTH_SIGNUP)
export const signUpWithFacebook = createAction(AUTH_SIGNUP_WITH_FACEBOOK)
export const verifySignUp = createAction(AUTH_VERIFY_SIGNUP)
export const resetSignUpVerification = createAction(AUTH_VERIFY_SIGNUP_RESET)

/* Reducer */

export default handleActions({

  /* Sign in actions */

  [requestSuccess(AUTH_SIGNIN)]: (state, { payload }) => state.withMutations(map => {
    const { token } = payload
    saveData({ token })
    map.set('signedIn', true)
  }),

  [requestFail(AUTH_SIGNIN)]: (state, { payload }) => state.withMutations(map => {
    map.set('signedIn', false)
  }),

  /* Get current user actions */

  [requestSuccess(AUTH_CURRENT_USER)]: (state, { payload }) => state.withMutations(map => {
    map.set('currentUser', Immutable.fromJS(payload))
    map.set('userLoaded', true)
  }),

  [requestFail(AUTH_CURRENT_USER)]: (state, { payload }) => state.withMutations(map => {
    map.set('currentUser', null)
    map.set('userLoaded', false)
  }),

  /* Update current user actions */

  [requestSuccess(AUTH_CURRENT_USER_UPDATE)]: (state, { payload }) => state.withMutations(map => {
    map.set('currentUser', Immutable.fromJS(payload))
  }),

  /* Sign out actions */

  [AUTH_SIGNOUT]: (state) => state.withMutations(map => {
    map.set('currentUser', null)
    map.set('signedIn', false)
    map.set('userLoaded', false)
    saveData({ token: '' })
  }),

}, initialState)
