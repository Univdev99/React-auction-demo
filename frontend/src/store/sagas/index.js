import { all } from 'redux-saga/effects'

import auth from './auth'
import charities from './admin/charities'


export default function* rootSaga() {
  yield all([
    auth(),
    charities(),
  ])
}
