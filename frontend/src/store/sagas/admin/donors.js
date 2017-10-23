import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_DONOR_LIST,
  ADMIN_CREATE_DONOR,
  ADMIN_GET_DONOR_DETAIL,
  ADMIN_UPDATE_DONOR_DETAIL,
  ADMIN_UPLOAD_DONOR_MEDIUM,
  ADMIN_DELETE_DONOR_MEDIUM,
  ADMIN_DELETE_DONOR,
  ADMIN_GET_DONOR_PRODUCT_LIST,
} from 'store/constants'


const getDonorList = apiCall({
  type: ADMIN_GET_DONOR_LIST,
  method: 'get',
  path: 'admin/donors/',
})

const createDonor = apiCall({
  type: ADMIN_CREATE_DONOR,
  method: 'post',
  path: 'admin/donors/',
})

const getDonorDetail = apiCall({
  type: ADMIN_GET_DONOR_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/donors/${payload.id}/`,
})

const updateDonorDetail = apiCall({
  type: ADMIN_UPDATE_DONOR_DETAIL,
  method: 'put',
  path: ({ payload }) => `admin/donors/${payload.id}/`,
})

const deleteDonor = apiCall({
  type: ADMIN_DELETE_DONOR,
  method: 'delete',
  path: ({ payload }) => `admin/donors/${payload.id}/`,
})

const getDonorProductList = apiCall({
  type: ADMIN_GET_DONOR_PRODUCT_LIST,
  method: 'get',
  path: ({ payload }) => `admin/donors/${payload.id}/products`,
})

const uploadDonorMedium = apiCall({
  type: ADMIN_UPLOAD_DONOR_MEDIUM,
  method: 'post',
  path: ({ payload }) => `admin/donors/${payload.id}/media/`,
})

const deleteDonorMedium = apiCall({
  type: ADMIN_DELETE_DONOR_MEDIUM,
  method: 'delete',
  path: ({ payload }) => `admin/donors/${payload.id}/media/${payload.dmId}/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_DONOR_LIST, getDonorList)
  yield takeLatest(ADMIN_CREATE_DONOR, createDonor)
  yield takeLatest(ADMIN_GET_DONOR_DETAIL, getDonorDetail)
  yield takeLatest(ADMIN_UPDATE_DONOR_DETAIL, updateDonorDetail)
  yield takeLatest(ADMIN_DELETE_DONOR, deleteDonor)
  yield takeLatest(ADMIN_GET_DONOR_PRODUCT_LIST, getDonorProductList)
  yield takeLatest(ADMIN_UPLOAD_DONOR_MEDIUM, uploadDonorMedium)
  yield takeLatest(ADMIN_DELETE_DONOR_MEDIUM, deleteDonorMedium)
}
