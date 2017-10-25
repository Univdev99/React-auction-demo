import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  DONOR_GET_LIST,
  DONOR_GET_FRONT_LIST,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  donorList: [],
  donorListLoaded: false,
  donorFrontList: [],
  donorFrontListLoaded: false,
})

/* Action creators */

export const getDonorList = createAction(DONOR_GET_LIST)
export const getDonorFrontList = createAction(DONOR_GET_FRONT_LIST)

/* Reducer */

export default handleActions({

  /* Get donor list actions */

  [requestSuccess(DONOR_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorList', Immutable.fromJS(payload))
    map.set('donorListLoaded', true)
  }),

  [requestFail(DONOR_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('donorList', Immutable.List())
    map.set('donorListLoaded', false)
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

}, initialState)
