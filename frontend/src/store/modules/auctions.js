import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  AUCTION_GET_FRONT_LIST,
  AUCTION_GET_FRONT_DETAIL,
  AUCTION_PLACE_BID
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Auction */
  auctionList: [],
  auctionListLoaded: false,
  auctionDetail: null
})

/* Action creators */

export const getAuctionFrontList = createAction(AUCTION_GET_FRONT_LIST)
export const getAuctionFrontDetail = createAction(AUCTION_GET_FRONT_DETAIL)
export const placeBid = createAction(AUCTION_PLACE_BID)

/* Reducer */

export default handleActions({

  /* Get auction list actions */

  [requestSuccess(AUCTION_GET_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionList', Immutable.fromJS(payload.results))
    map.set('auctionListLoaded', true)
  }),

  [requestFail(AUCTION_GET_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionList', Immutable.List())
    map.set('auctionListLoaded', false)
  }),

  /* Get auction detail actions */

  [AUCTION_GET_FRONT_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', null)
  }),

  [requestSuccess(AUCTION_GET_FRONT_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', Immutable.fromJS(payload))
  }),

  /* Update auction detail actions */

  [requestSuccess(AUCTION_GET_FRONT_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionDetail', Immutable.fromJS(payload))
  }),

}, initialState)
