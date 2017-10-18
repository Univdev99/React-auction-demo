import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_CHARITY_LIST,
  ADMIN_GET_CHARITY_DETAIL,
} from 'store/constants'


const getCharityList = apiCall({
  type: ADMIN_GET_CHARITY_LIST,
  method: 'get',
  path: 'admin/charities/',
})

const getCharityDetail = apiCall({
  type: ADMIN_GET_CHARITY_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/charities/${payload.id}`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_CHARITY_LIST, getCharityList)
  yield takeLatest(ADMIN_GET_CHARITY_DETAIL, getCharityDetail)
}
