import { call, select, takeLatest } from 'redux-saga/effects'


import apiCall from 'store/api/call'
import {
  AUCTION_GET_LIST,
  AUCTION_GET_DETAIL,
  AUCTION_GET_TRENDING_LIST,
  AUCTION_PLACE_BID
} from 'store/constants'
import { auctionsSelector } from 'store/selectors'


const getAuctionList = function* (action) {
  const donor = yield select(auctionsSelector)
  const loadMore = action.payload && action.payload.loadMore
  const page = loadMore ? donor.get('auctionListNextPage') : 1

  yield call(apiCall({
    type: AUCTION_GET_LIST,
    method: 'get',
    path: 'auctions/',
    params: { page },
    payloadOnSuccess: (data, action) => ({
      ...data,
      loadMore,
      nextPage: data.next ? page + 1 : null
    })
  }), action)
}

const getAuctionDetail = apiCall({
  type: AUCTION_GET_DETAIL,
  method: 'get',
  path: ({ payload }) => `auctions/${payload.id}/`,
})

const placeBid = apiCall({
  type: AUCTION_PLACE_BID,
  method: 'post',
  path: ({ payload }) => `auctions/${payload.id}/bid/`,
})

const getTrendingAuctionList = apiCall({
  type: AUCTION_GET_TRENDING_LIST,
  method: 'get',
  path: 'auctions/front/',
})

export default function* rootSaga () {
  yield takeLatest(AUCTION_GET_LIST, getAuctionList)
  yield takeLatest(AUCTION_GET_DETAIL, getAuctionDetail)
  yield takeLatest(AUCTION_GET_TRENDING_LIST, getTrendingAuctionList)
  yield takeLatest(AUCTION_PLACE_BID, placeBid)
}
