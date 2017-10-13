import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  AUTH_SIGNIN,
  AUTH_CURRENT_USER,
} from 'store/constants'

const doSignIn = apiCall({
  type: AUTH_SIGNIN,
  method: 'post',
  path: 'signin/',
})

const getCurrentUser = apiCall({
  type: AUTH_CURRENT_USER,
  method: 'get',
  path: 'current-user/',
})

export default function* rootSaga () {
  yield takeLatest(AUTH_SIGNIN, doSignIn)
  yield takeLatest(AUTH_CURRENT_USER, getCurrentUser)
}
