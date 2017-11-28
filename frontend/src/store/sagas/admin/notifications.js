import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_NOTIFICATION_LIST_ON_MENU,
  ADMIN_GET_NOTIFICATION_PAGE,
} from 'store/constants'

const getNotificationListOnMenu = apiCall({
  type: ADMIN_GET_NOTIFICATION_LIST_ON_MENU,
  method: 'get',
  path: 'admin/notifications/menu',
})

const getNotificationListPage = apiCall({
  type: ADMIN_GET_NOTIFICATION_PAGE,
  method: 'get',
  path: ({ payload }) => `admin/notifications/?page=${payload.page}/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_NOTIFICATION_LIST_ON_MENU, getNotificationListOnMenu)
  yield takeLatest(ADMIN_GET_NOTIFICATION_PAGE, getNotificationListPage)
}
