import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import {
  API_PENDING,
  API_SUCCESS,
  API_FAIL,
  requestPending,
  requestSuccess,
  requestFail
} from 'store/api/request'
import {
  BLOG_GET_POST_FRONT_LIST,
  BLOG_GET_POST_LIST_PAGE,
  BLOG_GET_POST_DETAIL,
  BLOG_CREATE_POST_COMMENT,
  BLOG_GET_POST_COMMENT_LIST
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  postListPage: [],
  postListPageStatus: 'INIT',
  postCount: 0,
  postPageNumber: 1,

  postFrontList: [],
  postFrontListStatus: 'INIT',

  postDetail: null,
  postDetailStatus: 'INIT',

  commentList: [],
  commentListStatus: 'INIT'
})

/* Action creators */

export const getPostFrontList = createAction(BLOG_GET_POST_FRONT_LIST)
export const getPostListPage = createAction(BLOG_GET_POST_LIST_PAGE)
export const getPostDetail = createAction(BLOG_GET_POST_DETAIL)
export const getPostCommentList = createAction(BLOG_GET_POST_COMMENT_LIST)
export const createPostComment = createAction(BLOG_CREATE_POST_COMMENT)

/* Reducer */

export default handleActions({

  /* Get post list actions */

  [BLOG_GET_POST_LIST_PAGE]: (state, { payload }) => state.withMutations(map => {
    payload && payload.params && map.set('postPageNumber', payload.params.page || 1)
  }),

  [requestPending(BLOG_GET_POST_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPageStatus', API_PENDING)
  }),

  [requestSuccess(BLOG_GET_POST_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPage', Immutable.fromJS(payload.results))
    map.set('postCount', payload.count)
    map.set('postListPageStatus', API_SUCCESS)
  }),

  [requestFail(BLOG_GET_POST_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPage', Immutable.List())
    map.set('postCount', 0)
    map.set('postListPageStatus', API_FAIL)
  }),

  /* Get post front list actions */

  [requestPending(BLOG_GET_POST_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postFrontListStatus', API_PENDING)
  }),

  [requestSuccess(BLOG_GET_POST_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postFrontList', Immutable.fromJS(payload))
    map.set('postFrontListStatus', API_SUCCESS)
  }),

  [requestFail(BLOG_GET_POST_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postFrontList', Immutable.List())
    map.set('postFrontListStatus', API_FAIL)
  }),

  /* Get post detail actions */

  [requestPending(BLOG_GET_POST_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetailStatus', API_PENDING)
  }),

  [requestSuccess(BLOG_GET_POST_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetail', Immutable.fromJS(payload))
    map.set('postDetailStatus', API_SUCCESS)
  }),

  [requestFail(BLOG_GET_POST_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetail', null)
    map.set('postDetailStatus', API_FAIL)
  }),

  /* Get post comments actions */

  [requestPending(BLOG_GET_POST_COMMENT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('commentListStatus', API_PENDING)
  }),

  [requestSuccess(BLOG_GET_POST_COMMENT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('commentList', Immutable.fromJS(payload))
    map.set('commentListStatus', API_SUCCESS)
  }),

  [requestFail(BLOG_GET_POST_COMMENT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('commentList', Immutable.List())
    map.set('commentListStatus', API_FAIL)
  }),

  /* Create post comment action */

  [requestSuccess(BLOG_CREATE_POST_COMMENT)]: (state, { payload }) => state.withMutations(map => {
    map.set('commentList', state.get('commentList').unshift(payload))
  }),

}, initialState)
