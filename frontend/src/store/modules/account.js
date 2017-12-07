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
  ACCOUNT_GET_MY_BID_AUCTIONS,
  AUCTION_PLACE_BID
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  bidAuctionsList: [],
  bidAuctionsCount: 0,
  bidAuctionsPageNumber: 1,
  bidAuctionsStatus: 'INIT'
})

/* Action creators */

export const getMyBids = createAction(ACCOUNT_GET_MY_BID_AUCTIONS)

/* Reducer */

export default handleActions({

  /* Get bid auctions list actions */

  [ACCOUNT_GET_MY_BID_AUCTIONS]: (state, { payload }) => state.withMutations(map => {
    map.set('bidAuctionsPageNumber', payload.params.page)
  }),

  [requestPending(ACCOUNT_GET_MY_BID_AUCTIONS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidAuctionsStatus', API_PENDING)
  }),

  [requestSuccess(ACCOUNT_GET_MY_BID_AUCTIONS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidAuctionsList', Immutable.fromJS(payload.results))
    map.set('bidAuctionsCount', payload.count)
    map.set('bidAuctionsStatus', API_SUCCESS)
  }),

  [requestFail(ACCOUNT_GET_MY_BID_AUCTIONS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidAuctionsList', Immutable.List())
    map.set('bidAuctionsCount', 0)
    map.set('bidAuctionsStatus', API_FAIL)
  }),

  /* Update existing bid list if bid price updated */
  [requestSuccess(AUCTION_PLACE_BID)]: (state, { payload }) => state.withMutations(map => {
    const bidItemKey = map.get('bidAuctionsList').findKey((item) => item.get('pk') === payload.auction)
    if (typeof bidItemKey !== 'undefined') {
      map.setIn(['bidAuctionsList', bidItemKey, 'user_price'], payload.price)
    }
  })

}, initialState)
