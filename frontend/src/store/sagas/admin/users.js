import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_USER_LIST,
  ADMIN_BLOCK_UNBLOCK_USER,
} from 'store/constants'


const getUserList = apiCall({
  type: ADMIN_GET_USER_LIST,
  method: 'get',
  path: 'admin/users/',
})

const blockUnblockUser = apiCall({
  type: ADMIN_BLOCK_UNBLOCK_USER,
  method: 'put',
  path: ({ payload }) => `admin/users/${payload.id}/block/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_USER_LIST, getUserList)
  yield takeLatest(ADMIN_BLOCK_UNBLOCK_USER, blockUnblockUser)
}
