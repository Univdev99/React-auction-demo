import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_GET_CHARITY_LIST,
  ADMIN_GET_CHARITY_DETAIL,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Charity */
  charityList: [],
  loadingCharityList: false,
  loadingCharityListError: false,
  charityDetail: {},
  loadingCharityDetail: false,
  loadingCharityDetailError: false,
})

/* Action creators */

export const getCharityList = createAction(ADMIN_GET_CHARITY_LIST)
export const getCharityDetail = createAction(ADMIN_GET_CHARITY_DETAIL)

/* Reducer */

export default handleActions({

  /* Get charity list actions */

  [ADMIN_GET_CHARITY_LIST]: (state, { payload }) => state.withMutations(map => {
    map.set('loadingCharityList', true)
    map.set('loadingCharityListError', false)
  }),

  [requestSuccess(ADMIN_GET_CHARITY_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityList', Immutable.fromJS(payload))
    map.set('loadingCharityList', false)
    map.set('loadingCharityListError', false)
  }),

  [requestFail(ADMIN_GET_CHARITY_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityList', Immutable.fromJS(payload))
    map.set('loadingCharityList', false)
    map.set('loadingCharityListError', true)
  }),

  /* Get charity detail actions */

  [ADMIN_GET_CHARITY_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('loadingCharityDetail', true)
    map.set('loadingCharityDetailError', false)
  }),

  [requestSuccess(ADMIN_GET_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityDetail', Immutable.fromJS(payload))
    map.set('loadingCharityDetail', false)
    map.set('loadingCharityDetailError', false)
  }),

  [requestFail(ADMIN_GET_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityDetail', Immutable.fromJS(payload))
    map.set('loadingCharityDetail', false)
    map.set('loadingCharityDetailError', true)
  }),

}, initialState)
