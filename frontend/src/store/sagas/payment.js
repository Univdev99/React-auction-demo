import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  PAYMENT_TEST,
} from 'store/constants'


const testPayment = apiCall({
  type: PAYMENT_TEST,
  method: 'post',
  path: 'payment-test/',
})

export default function* rootSaga () {
  yield takeLatest(PAYMENT_TEST, testPayment)
}
