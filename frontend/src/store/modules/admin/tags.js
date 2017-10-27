import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import {
  ADMIN_GET_TAG_SUGGESTIONS,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
})

/* Action creators */

export const getTagSuggestions = createAction(ADMIN_GET_TAG_SUGGESTIONS)

/* Reducer */

export default handleActions({
}, initialState)
