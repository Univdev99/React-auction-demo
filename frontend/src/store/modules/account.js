import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ACCOUNT_GET_MY_BID_AUCTIONS,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  bidAuctionsList: [],
  bidAuctionsCount: 0,
  bidAuctionsPageNumber: 1,
  bidAuctionsLoaded: false
})

/* Action creators */

export const getMyBids = createAction(ACCOUNT_GET_MY_BID_AUCTIONS)

/* Reducer */

export default handleActions({

  /* Get bid auctions list actions */

  [ACCOUNT_GET_MY_BID_AUCTIONS]: (state, { payload }) => state.withMutations(map => {
    map.set('bidAuctionsPageNumber', payload.params.page)
  }),

  [requestSuccess(ACCOUNT_GET_MY_BID_AUCTIONS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidAuctionsList', Immutable.fromJS(payload.results))
    map.set('bidAuctionsCount', payload.count)
    map.set('bidAuctionsLoaded', true)
  }),

  [requestFail(ACCOUNT_GET_MY_BID_AUCTIONS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidAuctionsList', Immutable.List())
    map.set('bidAuctionsCount', 0)
    map.set('bidAuctionsLoaded', false)
  }),


}, initialState)
