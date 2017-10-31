import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  JOB_GET_LIST,
  JOB_GET_DETAIL
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  jobList: [],
  jobListLoaded: false,
  jobCount: 0,
  jobPageNumber: 1,
  jobDetail: null,
})

/* Action creators */

export const getJobList = createAction(JOB_GET_LIST)
export const getJobDetail = createAction(JOB_GET_DETAIL)

/* Reducer */

export default handleActions({

  /* Get job list actions */

  [requestSuccess(JOB_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobList', Immutable.fromJS(payload.results))
    map.set('jobCount', payload.count)
    map.set('jobListLoaded', true)
  }),

  [requestFail(JOB_GET_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobList', Immutable.List())
    map.set('jobCount', 0)
    map.set('jobListLoaded', false)
  }),

  /* Get job detail actions */

  [requestSuccess(JOB_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobDetail', Immutable.fromJS(payload))
  }),

  [requestFail(JOB_GET_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('jobDetail', null)
  }),

}, initialState)
