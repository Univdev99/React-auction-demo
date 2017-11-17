import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_SALE_LIST,
  ADMIN_UPDATE_SALE,
} from 'store/constants'


const getSaleList = apiCall({
  type: ADMIN_GET_SALE_LIST,
  method: 'get',
  path: ({ payload }) => `admin/sales/?page=${payload.page}`,
})

const updateSale = apiCall({
  type: ADMIN_UPDATE_SALE,
  method: 'put',
  path: ({ payload }) => `admin/sales/${payload.id}/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_SALE_LIST, getSaleList)
  yield takeLatest(ADMIN_UPDATE_SALE, updateSale)
}
