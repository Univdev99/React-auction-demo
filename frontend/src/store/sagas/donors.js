import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  DONOR_GET_LIST_PAGE,
  DONOR_GET_FRONT_LIST,
  DONOR_GET_DETAIL,
} from 'store/constants'


const getDonorListPage = apiCall({
  type: DONOR_GET_LIST_PAGE,
  method: 'get',
  path: 'donors/',
})

const getDonorFrontList = apiCall({
  type: DONOR_GET_FRONT_LIST,
  method: 'get',
  path: 'donors/front/',
})

const getDonorDetail = apiCall({
  type: DONOR_GET_DETAIL,
  method: 'get',
  path: ({ payload }) => `/donors/${payload.id}/`,
})

export default function* rootSaga () {
  yield takeLatest(DONOR_GET_LIST_PAGE, getDonorListPage)
  yield takeLatest(DONOR_GET_FRONT_LIST, getDonorFrontList)
  yield takeLatest(DONOR_GET_DETAIL, getDonorDetail)
}
