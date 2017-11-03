import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess } from 'store/api/request'
import {
  SETTINGS_GET_COUNTRIES
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  countries: [],
})

/* Action creators */

export const getCountries = createAction(SETTINGS_GET_COUNTRIES)

/* Reducer */

export default handleActions({

  /* Get donor list actions */

  [requestSuccess(SETTINGS_GET_COUNTRIES)]: (state, { payload }) => state.withMutations(map => {
    map.set('countries', Immutable.fromJS(payload))
  })

}, initialState)
