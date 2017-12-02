import { call, select, takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  DONOR_GET_LIST_PAGE,
  DONOR_GET_FRONT_LIST,
  DONOR_GET_DETAIL,
} from 'store/constants'
import { donorsSelector } from 'store/selectors'

const getDonorListPage = function* (action) {
  const donor = yield select(donorsSelector)
  const loadMore = action.payload && action.payload.loadMore
  const page = loadMore ? donor.get('donorNextPage') : 1

  yield call(apiCall({
    type: DONOR_GET_LIST_PAGE,
    method: 'get',
    path: 'donors/',
    params: { page },
    payloadOnSuccess: (data, action) => ({
      ...data,
      loadMore,
      nextPage: data.next ? page + 1 : null
    })
  }), action)
}

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
