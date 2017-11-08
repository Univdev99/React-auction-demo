import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  AUCTION_GET_FRONT_LIST,
  AUCTION_GET_FRONT_DETAIL,
  AUCTION_PLACE_BID
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

const placeBid = apiCall({
  type: AUCTION_PLACE_BID,
  method: 'post',
  path: ({ payload }) => `auctions/${payload.id}/bid/`,
})

export default function* rootSaga () {
  yield takeLatest(AUCTION_GET_FRONT_LIST, getAuctionFrontList)
  yield takeLatest(AUCTION_GET_FRONT_DETAIL, getAuctionFrontDetail)
  yield takeLatest(AUCTION_PLACE_BID, placeBid)
}
