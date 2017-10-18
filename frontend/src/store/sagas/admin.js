import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_CHARITY_LIST,
  ADMIN_GET_CHARITY_DETAIL,
  ADMIN_UPDATE_CHARITY_DETAIL,
  ADMIN_UPLOAD_CHARITY_LOGO,
} from 'store/constants'


const getCharityList = apiCall({
  type: ADMIN_GET_CHARITY_LIST,
  method: 'get',
  path: 'admin/charities/',
})

const getCharityDetail = apiCall({
  type: ADMIN_GET_CHARITY_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/charities/${payload.id}/`,
})

const updateCharityDetail = apiCall({
  type: ADMIN_UPDATE_CHARITY_DETAIL,
  method: 'put',
  path: ({ payload }) => `admin/charities/${payload.id}/`,
})

const uploadCharityLogo = apiCall({
  type: ADMIN_UPLOAD_CHARITY_LOGO,
  method: 'put',
  path: ({ payload }) => `admin/charities/${payload.id}/logo/`,
})


export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_CHARITY_LIST, getCharityList)
  yield takeLatest(ADMIN_GET_CHARITY_DETAIL, getCharityDetail)
  yield takeLatest(ADMIN_UPDATE_CHARITY_DETAIL, updateCharityDetail)
  yield takeLatest(ADMIN_UPLOAD_CHARITY_LOGO, uploadCharityLogo)
}
