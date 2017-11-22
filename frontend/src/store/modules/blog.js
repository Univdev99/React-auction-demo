import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  BLOG_GET_POST_FRONT_LIST,
  BLOG_GET_POST_LIST_PAGE,
  BLOG_GET_POST_DETAIL,
  BLOG_GET_POST_COMMENT_LIST
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  postListPage: [],
  postListPageLoaded: false,
  postCount: 0,
  postPageNumber: 1,
  postFrontList: [],
  postFrontListLoaded: false,
  postDetail: null,
  commentList: []
})

/* Action creators */

export const getPostFrontList = createAction(BLOG_GET_POST_FRONT_LIST)
export const getPostListPage = createAction(BLOG_GET_POST_LIST_PAGE)
export const getPostDetail = createAction(BLOG_GET_POST_DETAIL)
export const getPostCommentList = createAction(BLOG_GET_POST_COMMENT_LIST)

/* Reducer */

export default handleActions({

  /* Get post list actions */

  [requestSuccess(BLOG_GET_POST_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPage', Immutable.fromJS(payload.results))
    map.set('postCount', payload.count)
    map.set('postListPageLoaded', true)
  }),

  [requestFail(BLOG_GET_POST_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPage', Immutable.List())
    map.set('postCount', 0)
    map.set('postListPageLoaded', false)
  }),

  /* Get post front list actions */

  [requestSuccess(BLOG_GET_POST_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postFrontList', Immutable.fromJS(payload))
    map.set('postFrontListLoaded', true)
  }),

  [requestFail(BLOG_GET_POST_FRONT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postFrontList', Immutable.List())
    map.set('postFrontListLoaded', false)
  }),

  /* Get post detail actions */

  [requestSuccess(BLOG_GET_POST_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetail', Immutable.fromJS(payload))
  }),

  [requestFail(BLOG_GET_POST_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetail', null)
  }),

  /* Get post comments actions */

  [requestSuccess(BLOG_GET_POST_COMMENT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('commentList', Immutable.fromJS(payload))
  }),

  [requestFail(BLOG_GET_POST_COMMENT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('commentList', Immutable.List())
  }),

}, initialState)
