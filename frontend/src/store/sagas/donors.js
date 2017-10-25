import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  DONOR_GET_LIST,
  DONOR_GET_FRONT_LIST,
} from 'store/constants'


const getDonorList = apiCall({
  type: DONOR_GET_LIST,
  method: 'get',
  path: 'donors/',
})

const getDonorFrontList = apiCall({
  type: DONOR_GET_FRONT_LIST,
  method: 'get',
  path: 'donors/front/',
})

export default function* rootSaga () {
  yield takeLatest(DONOR_GET_LIST, getDonorList)
  yield takeLatest(DONOR_GET_FRONT_LIST, getDonorFrontList)
}
