import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ACCOUNT_SET_PAYMENT,
} from 'store/constants'


const setPayment = apiCall({
  type: ACCOUNT_SET_PAYMENT,
  method: 'post',
  path: 'account/payment/',
})

export default function* rootSaga () {
  yield takeLatest(ACCOUNT_SET_PAYMENT, setPayment)
}
