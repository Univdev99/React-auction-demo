import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_POST_LIST,
  ADMIN_GET_POST_DETAIL,
  ADMIN_CREATE_POST,
  ADMIN_UPDATE_POST,
} from 'store/constants'

const getPostList = apiCall({
  type: ADMIN_GET_POST_LIST,
  method: 'get',
  path: 'admin/posts/',
})

const getPostDetail = apiCall({
  type: ADMIN_GET_POST_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/posts/${payload.id}/`,
})

const createPost = apiCall({
  type: ADMIN_CREATE_POST,
  method: 'post',
  path: 'admin/posts/',
})

const updatePost = apiCall({
  type: ADMIN_UPDATE_POST,
  method: 'put',
  path: ({ payload }) => `admin/posts/${payload.id}/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_POST_LIST, getPostList)
  yield takeLatest(ADMIN_GET_POST_DETAIL, getPostDetail)
  yield takeLatest(ADMIN_CREATE_POST, createPost)
  yield takeLatest(ADMIN_UPDATE_POST, updatePost)
}
