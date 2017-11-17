import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_GET_SALE_LIST,
  ADMIN_UPDATE_SALE,
  ADMIN_SET_SALE_NOTE,
} from 'store/constants'
import { replaceListItem } from 'utils/list'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Sale */
  saleListPage: [],
  saleListPageLoaded: false,
  saleCount: 0,
  saleListPageNumber: 1,
})

/* Action creators */

export const getSaleList = createAction(ADMIN_GET_SALE_LIST)
export const updateSale = createAction(ADMIN_UPDATE_SALE)
export const setSaleNote = createAction(ADMIN_SET_SALE_NOTE)

/* Reducer */

export default handleActions({

  /* Get sale list actions */

  [ADMIN_GET_SALE_LIST]: (state, { payload }) => state.withMutations(map => {
    map.set('saleListPageNumber', payload.page)
  }),

  [requestSuccess(ADMIN_GET_SALE_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('saleListPage', Immutable.fromJS(payload.results))
    map.set('saleCount', payload.count)
    map.set('saleListPageLoaded', true)
  }),

  [requestFail(ADMIN_GET_SALE_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('saleListPage', Immutable.List())
    map.set('saleCount', 0)
    map.set('saleListPageLoaded', false)
  }),

  /* Update sale actions */

  [requestSuccess(ADMIN_UPDATE_SALE)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, map, 'saleListPage')
  }),

  /* Set sale note actions */

  [requestSuccess(ADMIN_SET_SALE_NOTE)]: (state, { payload }) => state.withMutations(map => {
    replaceListItem(payload, map, 'saleListPage')
  }),

}, initialState)
