import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_TAG_SUGGESTIONS,
} from 'store/constants'


const getTagSuggestions = apiCall({
  type: ADMIN_GET_TAG_SUGGESTIONS,
  method: 'get',
  path: ({ payload }) => `admin/tags/suggest/${payload.keyword}/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_TAG_SUGGESTIONS, getTagSuggestions)
}
