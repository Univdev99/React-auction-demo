import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_AUCTION_LIST,
  ADMIN_CREATE_AUCTION,
  ADMIN_GET_AUCTION_DETAIL,
  ADMIN_UPDATE_AUCTION_DETAIL,
  ADMIN_START_AUCTION,
  ADMIN_FINISH_AUCTION,
  ADMIN_CANCEL_AUCTION,
  ADMIN_GET_AUCTION_BID_LIST_PAGE,
  ADMIN_AUCTION_CHANGE_BID_STATUS,
  ADMIN_GET_AUCTION_BACKLOG,
} from 'store/constants'


const getAuctionList = apiCall({
  type: ADMIN_GET_AUCTION_LIST,
  method: 'get',
  path: ({ payload }) => `admin/auctions/?page=${payload.page}&status=${payload.status}`,
})

const createAuction = apiCall({
  type: ADMIN_CREATE_AUCTION,
  method: 'post',
  path: 'admin/auctions/',
})

const getAuctionDetail = apiCall({
  type: ADMIN_GET_AUCTION_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/auctions/${payload.id}/`,
})

const updateAuctionDetail = apiCall({
  type: ADMIN_UPDATE_AUCTION_DETAIL,
  method: 'put',
  path: ({ payload }) => `admin/auctions/${payload.id}/`,
})

const startAuction = apiCall({
  type: ADMIN_START_AUCTION,
  method: 'post',
  path: ({ payload }) => `admin/auctions/${payload.id}/start/`,
})

const finishAuction = apiCall({
  type: ADMIN_FINISH_AUCTION,
  method: 'post',
  path: ({ payload }) => `admin/auctions/${payload.id}/finish/`,
})

const cancelAuction = apiCall({
  type: ADMIN_CANCEL_AUCTION,
  method: 'post',
  path: ({ payload }) => `admin/auctions/${payload.id}/cancel/`,
})

const getAuctionBidListPage = apiCall({
  type: ADMIN_GET_AUCTION_BID_LIST_PAGE,
  method: 'get',
  path: ({ payload }) => `admin/auctions/${payload.id}/bids/?page=${payload.page}` +
    (payload.status ? `&status=${payload.status}` : ''),
})

const changeBidStatus = apiCall({
  type: ADMIN_AUCTION_CHANGE_BID_STATUS,
  method: 'put',
  path: ({ payload }) => `admin/auctions/${payload.id}/bids/${payload.bidId}/change-status/`,
})

const getAuctionBacklog = apiCall({
  type: ADMIN_GET_AUCTION_BACKLOG,
  method: 'get',
  path: 'admin/backlog',
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_AUCTION_LIST, getAuctionList)
  yield takeLatest(ADMIN_CREATE_AUCTION, createAuction)
  yield takeLatest(ADMIN_GET_AUCTION_DETAIL, getAuctionDetail)
  yield takeLatest(ADMIN_UPDATE_AUCTION_DETAIL, updateAuctionDetail)
  yield takeLatest(ADMIN_START_AUCTION, startAuction)
  yield takeLatest(ADMIN_FINISH_AUCTION, finishAuction)
  yield takeLatest(ADMIN_CANCEL_AUCTION, cancelAuction)
  yield takeLatest(ADMIN_GET_AUCTION_BID_LIST_PAGE, getAuctionBidListPage)
  yield takeLatest(ADMIN_AUCTION_CHANGE_BID_STATUS, changeBidStatus)
  yield takeLatest(ADMIN_GET_AUCTION_BACKLOG, getAuctionBacklog)
}
