import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_ADD_NOTIFICATION,
  ADMIN_RESET_NOTIFICATION_UNREAD_COUNT,
  ADMIN_GET_NOTIFICATION_LIST_ON_MENU,
  ADMIN_GET_NOTIFICATION_PAGE,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  notificationListOnMenu: [],
  notificationListOnMenuLoaded: false,
  notificationUnreadCount: 0,
  notificationListPage: false,
  notificationCount: 0,
  notificationListPageNumber: 1,
  notificationListPageLoaded: false,
})

/* Action creators */

export const addNotification = createAction(ADMIN_ADD_NOTIFICATION)
export const resetNotificationUnreadCount = createAction(ADMIN_RESET_NOTIFICATION_UNREAD_COUNT)
export const getNotificationListOnMenu = createAction(ADMIN_GET_NOTIFICATION_LIST_ON_MENU)
export const getNotificationListPage = createAction(ADMIN_GET_NOTIFICATION_PAGE)

/* Reducer */

export default handleActions({

  [ADMIN_ADD_NOTIFICATION]: (state, { payload }) => state.withMutations(map => {
    let notificationListOnMenu = state.get('notificationListOnMenu')
    notificationListOnMenu = notificationListOnMenu.push(Immutable.fromJS(payload)).slice(0, 5)
    let notificationUnreadCount = state.get('notificationUnreadCount')
    map.set('notificationListOnMenu', notificationListOnMenu)
    map.set('notificationUnreadCount', notificationUnreadCount + 1)
    map.set('notificationListOnMenuLoaded', true)
  }),

  [ADMIN_RESET_NOTIFICATION_UNREAD_COUNT]: (state, { payload }) => state.withMutations(map => {
    map.set('notificationUnreadCount', 0)
  }),

  /* Get first 5 notifications for notification menu */

  [requestSuccess(ADMIN_GET_NOTIFICATION_LIST_ON_MENU)]: (state, { payload }) => state.withMutations(map => {
    map.set('notificationListOnMenu', Immutable.fromJS(payload))
    map.set('notificationListOnMenuLoaded', true)
  }),

  [requestFail(ADMIN_GET_NOTIFICATION_LIST_ON_MENU)]: (state, { payload }) => state.withMutations(map => {
    map.set('notificationListOnMenu', Immutable.List())
    map.set('notificationListOnMenuLoaded', false)
  }),

  /* Get notification list actions */

  [ADMIN_GET_NOTIFICATION_PAGE]: (state, { payload }) => state.withMutations(map => {
    map.set('notificationListPageNumber', payload.page)
  }),

  [requestSuccess(ADMIN_GET_NOTIFICATION_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('notificationListPage', Immutable.fromJS(payload.results))
    map.set('notificationCount', payload.count)
    map.set('notificationListPageLoaded', true)
  }),

  [requestFail(ADMIN_GET_NOTIFICATION_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('notificationListPage', Immutable.List())
    map.set('notificationCount', 0)
    map.set('notificationListPageLoaded', false)
  }),

}, initialState)
