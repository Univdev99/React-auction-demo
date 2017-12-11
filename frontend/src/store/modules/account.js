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
  ACCOUNT_GET_MY_BIDS,
  AUCTION_PLACE_BID
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  bidsList: [],
  bidsCount: 0,
  bidsPageNumber: 1,
  bidsStatus: 'INIT'
})

/* Action creators */

export const getMyBids = createAction(ACCOUNT_GET_MY_BIDS)

/* Reducer */

export default handleActions({

  /* Get bid auctions list actions */

  [ACCOUNT_GET_MY_BIDS]: (state, { payload }) => state.withMutations(map => {
    map.set('bidsPageNumber', payload.params.page)
  }),

  [requestPending(ACCOUNT_GET_MY_BIDS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidsStatus', API_PENDING)
  }),

  [requestSuccess(ACCOUNT_GET_MY_BIDS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidsList', Immutable.fromJS(payload.results))
    map.set('bidsCount', payload.count)
    map.set('bidsStatus', API_SUCCESS)
  }),

  [requestFail(ACCOUNT_GET_MY_BIDS)]: (state, { payload }) => state.withMutations(map => {
    map.set('bidsList', Immutable.List())
    map.set('bidsCount', 0)
    map.set('bidsStatus', API_FAIL)
  }),

  /* Update existing bid list if bid price updated */
  [requestSuccess(AUCTION_PLACE_BID)]: (state, { payload }) => state.withMutations(map => {
    const bidItemKey = map.get('bidsList').findKey((item) => item.get('pk') === payload.pk)
    if (typeof bidItemKey !== 'undefined') {
      map.setIn(['bidsList', bidItemKey, 'price'], payload.price)
    }
  })

}, initialState)
