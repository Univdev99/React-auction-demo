import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
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
  auctionListLoaded: false,
  auctionTrendingList: [],
  auctionTrendingListLoaded: false,
  auctionDetail: null
})

/* Action creators */

export const getAuctionList = createAction(AUCTION_GET_LIST)
export const getAuctionDetail = createAction(AUCTION_GET_DETAIL)
export const getTrendingAuctionList = createAction(AUCTION_GET_TRENDING_LIST)
export const placeBid = createAction(AUCTION_PLACE_BID)

/* Reducer */

export default handleActions({

  /* Get auction list actions */

  [requestSuccess(AUCTION_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionList', Immutable.fromJS(payload.results))
    map.set('auctionListLoaded', true)
  }),

  [requestFail(AUCTION_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionList', Immutable.List())
    map.set('auctionListLoaded', false)
  }),

  /* Get trending auction list actions */

  [requestSuccess(AUCTION_GET_TRENDING_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionTrendingList', Immutable.fromJS(payload.results))
    map.set('auctionTrendingListLoaded', true)
  }),

  [requestFail(AUCTION_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionTrendingList', Immutable.List())
    map.set('auctionTrendingListLoaded', false)
  }),

  /* Get auction detail actions */

  [AUCTION_GET_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', null)
  }),

  [requestSuccess(AUCTION_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', Immutable.fromJS(payload))
  }),

  /* Update auction detail actions */

  [requestSuccess(AUCTION_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', Immutable.fromJS(payload))
  }),

}, initialState)
