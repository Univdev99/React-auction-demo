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
  DONOR_GET_LIST_PAGE,
  DONOR_GET_FRONT_LIST,
  DONOR_GET_DETAIL,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  donorListPage: [],
  donorListPageStatus: 'INIT',
  donorCount: 0,
  donorNextPage: 1,

  donorFrontList: [],
  donorFrontListStatus: 'INIT',

  donorDetail: null,
  donorDetailStatus: 'INIT'
})

/* Action creators */

export const getDonorListPage = createAction(DONOR_GET_LIST_PAGE)
export const getDonorFrontList = createAction(DONOR_GET_FRONT_LIST)
export const getDonorDetail = createAction(DONOR_GET_DETAIL)

/* Reducer */

export default handleActions({

  /* Get donor list actions */

  [requestPending(DONOR_GET_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorListPageStatus', API_PENDING)
  }),

  [requestSuccess(DONOR_GET_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    const newContent = Immutable.fromJS(payload.results)
    map.set(
      'donorListPage',
      payload.loadMore ? state.get('donorListPage').concat(newContent) : newContent
    )
    map.set('donorCount', payload.count)
    map.set('donorNextPage', payload.nextPage)
    map.set('donorListPageStatus', API_SUCCESS)
  }),

  [requestFail(DONOR_GET_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorListPage', Immutable.List())
    map.set('donorCount', 0)
    map.set('donorListPageStatus', API_FAIL)
  }),

  /* Get donor front list actions */

  [requestPending(DONOR_GET_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorFrontListStatus', API_PENDING)
  }),

  [requestSuccess(DONOR_GET_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorFrontList', Immutable.fromJS(payload))
    map.set('donorFrontListStatus', API_SUCCESS)
  }),

  [requestFail(DONOR_GET_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorFrontList', Immutable.List())
    map.set('donorFrontListStatus', API_FAIL)
  }),

  /* Get donor detail actions */

  [requestPending(DONOR_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorDetailStatus', API_PENDING)
  }),

  [requestSuccess(DONOR_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorDetail', Immutable.fromJS(payload))
    map.set('donorDetailStatus', API_SUCCESS)
  }),

  [requestFail(DONOR_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorDetail', null)
    map.set('donorDetailStatus', API_FAIL)
  }),

}, initialState)
