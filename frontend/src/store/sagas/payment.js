import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ACCOUNT_SET_PAYMENT,
  PAYMENT_TEST,
} from 'store/constants'


const setPayment = apiCall({
  type: ACCOUNT_SET_PAYMENT,
  method: 'post',
  path: 'account/payment/',
})

const testPayment = apiCall({
  type: PAYMENT_TEST,
  method: 'post',
  path: 'payment-test/',
})

export default function* rootSaga () {
  yield takeLatest(ACCOUNT_SET_PAYMENT, setPayment)
  yield takeLatest(PAYMENT_TEST, testPayment)
}
