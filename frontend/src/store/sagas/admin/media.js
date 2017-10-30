import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_MEDIUM_LIST_PAGE,
} from 'store/constants'


const getMediumListPage = apiCall({
  type: ADMIN_GET_MEDIUM_LIST_PAGE,
  method: 'get',
  path: ({ payload }) => `admin/media/?page=${payload.page}`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_MEDIUM_LIST_PAGE, getMediumListPage)
}
