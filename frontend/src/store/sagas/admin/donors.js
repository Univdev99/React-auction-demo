import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_DONOR_LIST,
  ADMIN_CREATE_DONOR,
  ADMIN_GET_DONOR_DETAIL,
  ADMIN_UPDATE_DONOR_DETAIL,
  ADMIN_UPLOAD_DONOR_LOGO,
  ADMIN_UPLOAD_DONOR_VIDEO,
  ADMIN_DELETE_DONOR,
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

const uploadDonorLogo = apiCall({
  type: ADMIN_UPLOAD_DONOR_LOGO,
  method: 'put',
  path: ({ payload }) => `admin/donors/${payload.id}/logo/`,
})

const uploadDonorVideo = apiCall({
  type: ADMIN_UPLOAD_DONOR_LOGO,
  method: 'put',
  path: ({ payload }) => `admin/donors/${payload.id}/video/`,
})

const deleteDonor = apiCall({
  type: ADMIN_DELETE_DONOR,
  method: 'delete',
  path: ({ payload }) => `admin/donors/${payload.id}/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_DONOR_LIST, getDonorList)
  yield takeLatest(ADMIN_CREATE_DONOR, createDonor)
  yield takeLatest(ADMIN_GET_DONOR_DETAIL, getDonorDetail)
  yield takeLatest(ADMIN_UPDATE_DONOR_DETAIL, updateDonorDetail)
  yield takeLatest(ADMIN_UPLOAD_DONOR_LOGO, uploadDonorLogo)
  yield takeLatest(ADMIN_UPLOAD_DONOR_VIDEO, uploadDonorVideo)
  yield takeLatest(ADMIN_DELETE_DONOR, deleteDonor)
}
