import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  DONOR_GET_LIST_PAGE,
  DONOR_GET_FRONT_LIST,
  DONOR_GET_DETAIL,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  donorListPage: [],
  donorListPageLoaded: false,
  donorCount: 0,
  donorPageNumber: 1,
  donorFrontList: [],
  donorFrontListLoaded: false,
  donorDetail: null,
})

/* Action creators */

export const getDonorListPage = createAction(DONOR_GET_LIST_PAGE)
export const getDonorFrontList = createAction(DONOR_GET_FRONT_LIST)
export const getDonorDetail = createAction(DONOR_GET_DETAIL)

/* Reducer */

export default handleActions({

  /* Get donor list actions */

  [requestSuccess(DONOR_GET_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorListPage', Immutable.fromJS(payload.results))
    map.set('donorCount', payload.count)
    map.set('donorListPageLoaded', true)
  }),

  [requestFail(DONOR_GET_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorListPage', Immutable.List())
    map.set('donorCount', 0)
    map.set('donorListPageLoaded', false)
  }),

  /* Get donor front list actions */

  [requestSuccess(DONOR_GET_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorFrontList', Immutable.fromJS(payload))
    map.set('donorFrontListLoaded', true)
  }),

  [requestFail(DONOR_GET_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorFrontList', Immutable.List())
    map.set('donorFrontListLoaded', false)
  }),

  /* Get donor detail actions */

  [requestSuccess(DONOR_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorDetail', Immutable.fromJS(payload))
  }),

  [requestFail(DONOR_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorDetail', null)
  }),

}, initialState)
