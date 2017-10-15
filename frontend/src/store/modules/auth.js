import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  AUTH_SIGNIN,
  AUTH_SIGNOUT,
  AUTH_SIGNUP,
  AUTH_CURRENT_USER,
} from 'store/constants'

import { loadData, saveData } from 'utils/storage'


/* Initial state */

function getInitialState() {
  const { token } = loadData()
  return {
    username: '',
    email: '',
    signedIn: !!token,
    signInError: false,
    userLoaded: false,
    signUpError: false,
  }
}
const initialState = Immutable.Map(getInitialState())

/* Action creators */

export const signIn = createAction(AUTH_SIGNIN)
export const signOut = createAction(AUTH_SIGNOUT)
export const getCurrentUser = createAction(AUTH_CURRENT_USER)
export const signUp = createAction(AUTH_SIGNUP)

/* Reducer */

export default handleActions({
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
  [requestSuccess(AUTH_CURRENT_USER)]: (state, { payload }) => state.withMutations(map => {
    const { username, email } = payload
    map.set('username', username)
    map.set('email', email)
    map.set('userLoaded', true)
  }),
  [requestFail(AUTH_CURRENT_USER)]: (state, { payload }) => state.withMutations(map => {
    map.set('username', '')
    map.set('email', '')
    map.set('userLoaded', false)
  }),
  [AUTH_SIGNOUT]: (state) => state.withMutations(map => {
    map.set('username', '')
    map.set('email', '')
    map.set('signedIn', false)
    map.set('signInError', false)
    map.set('userLoaded', false)
    saveData({ token: '' })
  }),
  [requestSuccess(AUTH_SIGNUP)]: (state, { payload }) => state.withMutations(map => {
    map.set('signUpError', false)
  }),
  [requestFail(AUTH_SIGNUP)]: (state, { payload }) => state.withMutations(map => {
    map.set('signUpError', true)
  }),
}, initialState)
