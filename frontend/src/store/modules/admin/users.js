import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_GET_USER_LIST,
  ADMIN_BLOCK_UNBLOCK_USER,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  userList: [],
  userListLoaded: false,
})

/* Action creators */

export const getUserList = createAction(ADMIN_GET_USER_LIST)
export const blockUnblockUser = createAction(ADMIN_BLOCK_UNBLOCK_USER)

/* Reducer */

export default handleActions({

  /* Get user list actions */

  [requestSuccess(ADMIN_GET_USER_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('userList', Immutable.fromJS(payload))
    map.set('userListLoaded', true)
  }),

  [requestFail(ADMIN_GET_USER_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('userList', Immutable.List())
    map.set('userListLoaded', false)
  }),

  /* Block/unblock user actions */

  [requestSuccess(ADMIN_BLOCK_UNBLOCK_USER)]: (state, { payload }) => state.withMutations(map => {
    const userList = state.get('userList')
    const index = userList.findIndex(pm => pm.get('pk') === payload.pk)
    if (index >= 0) {
      map.setIn(['userList', index], Immutable.fromJS(payload))
    }
  }),

}, initialState)
