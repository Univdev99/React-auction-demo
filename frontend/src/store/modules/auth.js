import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  AUTH_SIGNIN,
} from 'store/constants'

import { saveData } from 'utils/storage'


const initialState = Immutable.Map({
  username: '',
  email: '',
  signedIn: false,
  error: false,
})

export const signIn = createAction(AUTH_SIGNIN)

export default handleActions({
  [requestSuccess(AUTH_SIGNIN)]: (state, { payload }) => state.withMutations(map => {
    const { token } = payload
    saveData({ token })
    map.set('signedIn', true)
    map.set('error', false)
  }),
  [requestFail(AUTH_SIGNIN)]: (state, { payload }) => state.withMutations(map => {
    map.set('signedIn', false)
    map.set('error', true)
  }),
}, initialState)
