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
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Auction */
  auctionList: [],
  auctionListLoaded: false,
  auctionDetail: null,
  auctionProductList: [],
  auctionProductListLoaded: false,
})

/* Action creators */

export const getAuctionList = createAction(ADMIN_GET_AUCTION_LIST)
export const createAuction = createAction(ADMIN_CREATE_AUCTION)
export const getAuctionDetail = createAction(ADMIN_GET_AUCTION_DETAIL)
export const updateAuctionDetail = createAction(ADMIN_UPDATE_AUCTION_DETAIL)
export const startAuction = createAction(ADMIN_START_AUCTION)
export const finishAuction = createAction(ADMIN_FINISH_AUCTION)
export const cancelAuction = createAction(ADMIN_CANCEL_AUCTION)

/* Reducer helpers */

function replaceListItem(payload, state, map) {
  if (state.get('auctionListLoaded')) {
    const { pk } = payload
    const auctionList = state.get('auctionList')
    const index = auctionList.findIndex(auction => auction.get('pk') === pk)
    if (index >= 0) {
      map.setIn(['auctionList', index], Immutable.fromJS(payload))
    }
  }
}

/* Reducer */

export default handleActions({

  /* Get auction list actions */

  [requestSuccess(ADMIN_GET_AUCTION_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionList', Immutable.fromJS(payload))
    map.set('auctionListLoaded', true)
  }),

  [requestFail(ADMIN_GET_AUCTION_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('auctionList', Immutable.List())
    map.set('auctionListLoaded', false)
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
    replaceListItem(payload, state, map)
  }),

  /* Finish auction actions */

  [requestSuccess(ADMIN_FINISH_AUCTION)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, state, map)
  }),

  /* Cancel auction actions */

  [requestSuccess(ADMIN_CANCEL_AUCTION)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, state, map)
  }),

}, initialState)
