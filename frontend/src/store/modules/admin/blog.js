import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_GET_POST_LIST,
  ADMIN_CREATE_POST,
  ADMIN_GET_POST_DETAIL,
  ADMIN_UPDATE_POST,
} from 'store/constants'
// import { replaceListItem } from 'utils/list'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Post */
  postListPage: [],
  postListPageLoaded: false,
  postCount: 0,
  postListPageNumber: 1,
  postDetail: null,
})

/* Action creators */

export const getPostList = createAction(ADMIN_GET_POST_LIST)
export const getPostDetail = createAction(ADMIN_GET_POST_DETAIL)
export const createPost = createAction(ADMIN_CREATE_POST)
export const updatePost = createAction(ADMIN_UPDATE_POST)

/* Reducer */

export default handleActions({

  /* Get post list actions */

  [ADMIN_GET_POST_LIST]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPageNumber', payload.page)
  }),

  [requestSuccess(ADMIN_GET_POST_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPage', Immutable.fromJS(payload.results))
    map.set('postCount', payload.count)
    map.set('postListPageLoaded', true)
  }),

  [requestFail(ADMIN_GET_POST_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postListPage', Immutable.List())
    map.set('postCount', 0)
    map.set('postListPageLoaded', false)
  }),

  /* Get post detail actions */

  [ADMIN_GET_POST_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetail', null)
  }),

  [requestSuccess(ADMIN_GET_POST_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetail', Immutable.fromJS(payload))
  }),

  /* Update post actions */

  [requestSuccess(ADMIN_UPDATE_POST)]: (state, { payload }) => state.withMutations(map => {
    map.set('postDetail', Immutable.fromJS(payload))
  }),

}, initialState)
