import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  AUCTION_GET_FRONT_LIST,
  AUCTION_GET_FRONT_DETAIL,
} from 'store/constants'


const getAuctionFrontList = apiCall({
  type: AUCTION_GET_FRONT_LIST,
  method: 'get',
  path: 'auctions/',
})

const getAuctionFrontDetail = apiCall({
  type: AUCTION_GET_FRONT_DETAIL,
  method: 'get',
  path: ({ payload }) => `auctions/${payload.id}/`,
})

export default function* rootSaga () {
  yield takeLatest(AUCTION_GET_FRONT_LIST, getAuctionFrontList)
  yield takeLatest(AUCTION_GET_FRONT_DETAIL, getAuctionFrontDetail)
}
