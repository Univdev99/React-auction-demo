import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  BLOG_GET_POST_FRONT_LIST,
  BLOG_GET_POST_LIST_PAGE,
  BLOG_GET_POST_DETAIL,
  BLOG_GET_POST_COMMENT_LIST
} from 'store/constants'


const getPostListPage = apiCall({
  type: BLOG_GET_POST_LIST_PAGE,
  method: 'get',
  path: 'posts/',
})

const getPostFrontList = apiCall({
  type: BLOG_GET_POST_FRONT_LIST,
  method: 'get',
  path: 'posts/front/',
})

const getPostDetail = apiCall({
  type: BLOG_GET_POST_DETAIL,
  method: 'get',
  path: ({ payload }) => `/posts/${payload.id}/`,
})

const getPostCommentList = apiCall({
  type: BLOG_GET_POST_COMMENT_LIST,
  method: 'get',
  path: ({ payload }) => `/posts/${payload.id}/comments`,
})

export default function* rootSaga () {
  yield takeLatest(BLOG_GET_POST_LIST_PAGE, getPostListPage)
  yield takeLatest(BLOG_GET_POST_FRONT_LIST, getPostFrontList)
  yield takeLatest(BLOG_GET_POST_DETAIL, getPostDetail)
  yield takeLatest(BLOG_GET_POST_COMMENT_LIST, getPostCommentList)
}
