import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import {
  API_PENDING,
  API_SUCCESS,
  API_FAIL,
  requestPending,
  requestSuccess,
  requestFail
} from 'store/api/request'
import {
  AUCTION_GET_LIST,
  AUCTION_GET_DETAIL,
  AUCTION_GET_TRENDING_LIST,
  AUCTION_PLACE_BID
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Auction */
  auctionList: [],
  auctionListCount: 0,
  auctionListNextPage: 1,
  auctionListStatus: 'INIT',

  auctionTrendingList: [],
  auctionTrendingListStatus: 'INIT',

  auctionDetail: null,
  auctionDetailStatus: 'INIT'
})

/* Action creators */

export const getAuctionList = createAction(AUCTION_GET_LIST)
export const getAuctionDetail = createAction(AUCTION_GET_DETAIL)
export const getTrendingAuctionList = createAction(AUCTION_GET_TRENDING_LIST)
export const placeBid = createAction(AUCTION_PLACE_BID)

/* Reducer */

export default handleActions({

  /* Get donor list actions */

  [requestPending(AUCTION_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionListStatus', API_PENDING)
  }),

  [requestSuccess(AUCTION_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    const newContent = Immutable.fromJS(payload.results)
    map.set(
      'auctionList',
      payload.loadMore ? state.get('auctionList').concat(newContent) : newContent
    )
    map.set('auctionListCount', payload.count)
    map.set('auctionListNextPage', payload.nextPage)
    map.set('auctionListStatus', API_SUCCESS)
  }),

  [requestFail(AUCTION_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionList', Immutable.List())
    map.set('auctionListCount', 0)
    map.set('auctionListStatus', API_FAIL)
  }),

  /* Get trending auction list actions */

  [requestPending(AUCTION_GET_TRENDING_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionTrendingListStatus', API_PENDING)
  }),

  [requestSuccess(AUCTION_GET_TRENDING_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionTrendingList', Immutable.fromJS(payload.results))
    map.set('auctionTrendingListStatus', API_SUCCESS)
  }),

  [requestFail(AUCTION_GET_TRENDING_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionTrendingList', Immutable.List())
    map.set('auctionTrendingListStatus', API_FAIL)
  }),

  /* Get auction detail actions */

  [requestPending(AUCTION_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetailStatus', API_PENDING)
  }),

  [requestSuccess(AUCTION_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', Immutable.fromJS(payload))
    map.set('auctionDetailStatus', API_SUCCESS)
  }),

  [requestFail(AUCTION_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', null)
    map.set('auctionDetailStatus', API_FAIL)
  }),

  /* Update existing bid list if bid price updated */
  [requestSuccess(AUCTION_PLACE_BID)]: (state, { payload }) => state.withMutations(map => {
    const auctionIndex = map.get('auctionList').findKey((item) => item.get('pk') === payload.auction)
    if (typeof auctionIndex !== 'undefined') {
      map.setIn(['auctionList', auctionIndex, 'current_price'], payload.price)
    }

    const trendingIndex = map.get('auctionTrendingList').findKey((item) => item.get('pk') === payload.auction)
    if (typeof trendingIndex !== 'undefined') {
      map.setIn(['auctionTrendingList', trendingIndex, 'current_price'], payload.price)
    }
  }),

}, initialState)
