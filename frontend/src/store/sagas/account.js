import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ACCOUNT_GET_MY_BID_AUCTIONS
} from 'store/constants'


const getMyBids = apiCall({
  type: ACCOUNT_GET_MY_BID_AUCTIONS,
  method: 'get',
  path: 'account/bid-auctions/',
})

export default function* rootSaga () {
  yield takeLatest(ACCOUNT_GET_MY_BID_AUCTIONS, getMyBids)
}
