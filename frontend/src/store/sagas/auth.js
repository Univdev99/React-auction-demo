import { call, takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import { getCurrentUser as getCurrentUserAction } from 'store/modules/auth'
import {
  AUTH_SIGNIN,
  AUTH_SIGNUP,
  AUTH_SIGNUP_WITH_FACEBOOK,
  AUTH_VERIFY_SIGNUP,
  AUTH_CURRENT_USER,
  AUTH_CURRENT_USER_UPDATE,
  AUTH_CURRENT_USER_AVATAR_UPLOAD,
  AUTH_PASSWORD_UPDATE
} from 'store/constants'


const signIn = apiCall({
  type: AUTH_SIGNIN,
  method: 'post',
  path: 'signin/',
})

const signUpWithFacebook = apiCall({
  type: AUTH_SIGNUP_WITH_FACEBOOK,
  method: 'post',
  path: 'signup-with-facebook/',
})

const doSignUp = apiCall({
  type: AUTH_SIGNUP,
  method: 'post',
  path: 'signup/',
})

const doVerifySignUp = apiCall({
  type: AUTH_VERIFY_SIGNUP,
  method: 'post',
  path: 'verify-signup/',
})

const getCurrentUser = apiCall({
  type: AUTH_CURRENT_USER,
  method: 'get',
  path: 'current-user/',
})

const doSignIn = function* (action) {
  const { success, ...payload } = (action.payload || {})
  const status = yield call(signIn, {
    type: action.type,
    payload
  })

  status && (
    yield call(getCurrentUser, getCurrentUserAction({ success }))
  )
}

const doSignUpWithFacebook = function* (action) {
  const { success, ...payload } = (action.payload || {})
  const status = yield call(signUpWithFacebook, {
    type: action.type,
    payload
  })

  status && (
    yield call(getCurrentUser, getCurrentUserAction({ success }))
  )
}

const updateCurrentUser = apiCall({
  type: AUTH_CURRENT_USER_UPDATE,
  method: 'put',
  path: 'current-user/',
})

const uploadCurrentUserAvatar = apiCall({
  type: AUTH_CURRENT_USER_AVATAR_UPLOAD,
  method: 'put',
  path: ({ payload }) => `current-user/avatar/`,
})

const updatePassword = apiCall({
  type: AUTH_PASSWORD_UPDATE,
  method: 'put',
  path: 'current-user/update-password/',
})

export default function* rootSaga () {
  yield takeLatest(AUTH_SIGNIN, doSignIn)
  yield takeLatest(AUTH_SIGNUP, doSignUp)
  yield takeLatest(AUTH_SIGNUP_WITH_FACEBOOK, doSignUpWithFacebook)
  yield takeLatest(AUTH_VERIFY_SIGNUP, doVerifySignUp)
  yield takeLatest(AUTH_CURRENT_USER, getCurrentUser)
  yield takeLatest(AUTH_CURRENT_USER_UPDATE, updateCurrentUser)
  yield takeLatest(AUTH_CURRENT_USER_AVATAR_UPLOAD, uploadCurrentUserAvatar)
  yield takeLatest(AUTH_PASSWORD_UPDATE, updatePassword)
}
