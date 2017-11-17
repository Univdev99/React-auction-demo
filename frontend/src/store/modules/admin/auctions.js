import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
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
} from 'store/constants'
import { replaceListItem } from 'utils/list'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Auction */
  auctionListPage: [],
  auctionListPageLoaded: false,
  auctionCount: 0,
  auctionListPageNumber: 1,
  auctionDetail: null,
  auctionProductList: [],
  auctionProductListLoaded: false,
  /* Bid */
  bidListPage: [],
  bidCount: 0,
  bidListPageLoaded: false,
  bidListPageNumber: 1,
})

/* Action creators */

export const getAuctionList = createAction(ADMIN_GET_AUCTION_LIST)
export const createAuction = createAction(ADMIN_CREATE_AUCTION)
export const getAuctionDetail = createAction(ADMIN_GET_AUCTION_DETAIL)
export const updateAuctionDetail = createAction(ADMIN_UPDATE_AUCTION_DETAIL)
export const startAuction = createAction(ADMIN_START_AUCTION)
export const finishAuction = createAction(ADMIN_FINISH_AUCTION)
export const cancelAuction = createAction(ADMIN_CANCEL_AUCTION)
export const getAuctionBidListPage = createAction(ADMIN_GET_AUCTION_BID_LIST_PAGE)
export const changeBidStatus = createAction(ADMIN_AUCTION_CHANGE_BID_STATUS)

/* Reducer */

export default handleActions({

  /* Get auction list actions */

  [ADMIN_GET_AUCTION_LIST]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionListPageNumber', payload.page)
  }),

  [requestSuccess(ADMIN_GET_AUCTION_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionListPage', Immutable.fromJS(payload.results))
    map.set('auctionCount', payload.count)
    map.set('auctionListPageLoaded', true)
  }),

  [requestFail(ADMIN_GET_AUCTION_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionListPage', Immutable.List())
    map.set('auctionCount', 0)
    map.set('auctionListPageLoaded', false)
  }),

  /* Get auction detail actions */

  [ADMIN_GET_AUCTION_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', null)
  }),

  [requestSuccess(ADMIN_GET_AUCTION_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', Immutable.fromJS(payload))
  }),

  /* Update auction detail actions */

  [requestSuccess(ADMIN_UPDATE_AUCTION_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', Immutable.fromJS(payload))
  }),

  /* Start auction actions */

  [requestSuccess(ADMIN_START_AUCTION)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, map, 'auctionListPage')
  }),

  /* Finish auction actions */

  [requestSuccess(ADMIN_FINISH_AUCTION)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, map, 'auctionListPage')
  }),

  /* Cancel auction actions */

  [requestSuccess(ADMIN_CANCEL_AUCTION)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, map, 'auctionListPage')
  }),

  /* Get auction bid list page actions */

  [ADMIN_GET_AUCTION_BID_LIST_PAGE]: (state, { payload }) => state.withMutations(map => {
    map.set('bidListPageNumber', payload.page)
  }),

  [requestSuccess(ADMIN_GET_AUCTION_BID_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidListPage', Immutable.fromJS(payload.results))
    map.set('bidCount', payload.count)
    map.set('bidListPageLoaded', true)
  }),

  [requestFail(ADMIN_GET_AUCTION_BID_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidListPage', Immutable.List())
    map.set('bidCount', 0)
    map.set('bidListPageLoaded', false)
  }),

  /* Get auction change bid status actions */

  [requestSuccess(ADMIN_AUCTION_CHANGE_BID_STATUS)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, map, 'bidListPage')
  }),

}, initialState)
