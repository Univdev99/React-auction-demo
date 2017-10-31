import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  JOB_GET_LIST,
  JOB_GET_DETAIL
} from 'store/constants'


const getJobList = apiCall({
  type: JOB_GET_LIST,
  method: 'get',
  path: 'jobs/',
})

const getJobDetail = apiCall({
  type: JOB_GET_DETAIL,
  method: 'get',
  path: ({ payload }) => `/jobs/${payload.id}/`,
})

export default function* rootSaga () {
  yield takeLatest(JOB_GET_LIST, getJobList)
  yield takeLatest(JOB_GET_DETAIL, getJobDetail)
}
