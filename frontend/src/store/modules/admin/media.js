import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_GET_MEDIUM_LIST_PAGE,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  mediumListPage: [],
  mediumListPageLoaded: false,
  mediumCount: 0,
  mediumPageNumber: 1,
})

/* Action creators */

export const getMediumListPage = createAction(ADMIN_GET_MEDIUM_LIST_PAGE)

/* Reducer */

export default handleActions({

  /* Get product list actions */

  [ADMIN_GET_MEDIUM_LIST_PAGE]: (state, { payload }) => state.withMutations(map => {
    map.set('mediumPageNumber', payload.page)
  }),

  [requestSuccess(ADMIN_GET_MEDIUM_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('mediumListPage', Immutable.fromJS(payload.results))
    map.set('mediumListPageLoaded', true)
    map.set('mediumCount', payload.count)
  }),

  [requestFail(ADMIN_GET_MEDIUM_LIST_PAGE)]: (state, { payload }) => state.withMutations(map => {
    map.set('mediumListPage', Immutable.List())
    map.set('mediumListPageLoaded', false)
    map.set('mediumCount', 0)
  }),

}, initialState)
