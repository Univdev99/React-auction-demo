import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  SETTINGS_GET_COUNTRIES
} from 'store/constants'


const getCountries = apiCall({
  type: SETTINGS_GET_COUNTRIES,
  method: 'get',
  path: 'settings/countries',
})

export default function* rootSaga () {
  yield takeLatest(SETTINGS_GET_COUNTRIES, getCountries)
}
