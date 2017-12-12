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
  JOB_GET_LIST,
  JOB_GET_DETAIL
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  jobList: [],
  jobListStatus: 'INIT',
  jobListCount: 0,
  jobPageNumber: 1,

  jobDetail: null,
  jobDetailStatus: 'INIT'
})

/* Action creators */

export const getJobList = createAction(JOB_GET_LIST)
export const getJobDetail = createAction(JOB_GET_DETAIL)

/* Reducer */

export default handleActions({

  /* Get job list actions */

  [requestPending(JOB_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobListStatus', API_PENDING)
  }),

  [requestSuccess(JOB_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobList', Immutable.fromJS(payload.results))
    map.set('jobListCount', payload.count)
    map.set('jobListStatus', API_SUCCESS)
  }),

  [requestFail(JOB_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobList', Immutable.List())
    map.set('jobListCount', 0)
    map.set('jobListStatus', API_FAIL)
  }),

  /* Get job detail actions */

  [requestPending(JOB_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobDetailStatus', API_PENDING)
  }),

  [requestSuccess(JOB_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobDetail', Immutable.fromJS(payload))
    map.set('jobDetailStatus', API_SUCCESS)
  }),

  [requestFail(JOB_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobDetail', null)
    map.set('jobDetailStatus', API_FAIL)
  }),

}, initialState)
