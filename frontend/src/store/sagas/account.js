import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ACCOUNT_GET_MY_BIDS
} from 'store/constants'


const getMyBids = apiCall({
  type: ACCOUNT_GET_MY_BIDS,
  method: 'get',
  path: 'account/bids/',
})

export default function* rootSaga () {
  yield takeLatest(ACCOUNT_GET_MY_BIDS, getMyBids)
}
