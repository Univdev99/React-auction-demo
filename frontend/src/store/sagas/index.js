import { all } from 'redux-saga/effects'

import auth from './auth'
import admin from './admin'


export default function* rootSaga() {
  yield all([
    auth(),
    admin(),
  ])
}
