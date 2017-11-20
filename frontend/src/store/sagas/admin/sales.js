import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_SALE_LIST,
  ADMIN_GET_SALE_DETAIL,
  ADMIN_UPDATE_SALE,
  ADMIN_SET_SALE_NOTE,
} from 'store/constants'


const getSaleList = apiCall({
  type: ADMIN_GET_SALE_LIST,
  method: 'get',
  path: ({ payload }) => `admin/sales/?page=${payload.page}`,
})

const getSaleDetail = apiCall({
  type: ADMIN_GET_SALE_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/sales/${payload.id}/`,
})

const updateSale = apiCall({
  type: ADMIN_UPDATE_SALE,
  method: 'put',
  path: ({ payload }) => `admin/sales/${payload.id}/`,
})

const setSaleNote = apiCall({
  type: ADMIN_SET_SALE_NOTE,
  method: 'put',
  path: ({ payload }) => `admin/sales/${payload.id}/note/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_SALE_LIST, getSaleList)
  yield takeLatest(ADMIN_GET_SALE_DETAIL, getSaleDetail)
  yield takeLatest(ADMIN_UPDATE_SALE, updateSale)
  yield takeLatest(ADMIN_SET_SALE_NOTE, setSaleNote)
}
