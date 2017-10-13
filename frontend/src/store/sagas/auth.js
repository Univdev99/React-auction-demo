import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  AUTH_SIGNIN,
} from 'store/constants'

const doSignIn = apiCall({
  type: AUTH_SIGNIN,
  method: 'post',
  path: 'signin/',
  // success: (res, action) => {
  //   const { data: { token } } = res
  // }
})

export default function* rootSaga () {
  yield takeLatest(AUTH_SIGNIN, doSignIn)
}
