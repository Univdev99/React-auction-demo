import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess } from 'store/api/request'
import {
  ADMIN_GET_CHARITY_LIST,
  ADMIN_CREATE_CHARITY,
  ADMIN_GET_CHARITY_DETAIL,
  ADMIN_UPDATE_CHARITY_DETAIL,
  ADMIN_UPLOAD_CHARITY_LOGO,
  ADMIN_DELETE_CHARITY,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Charity */
  charityList: [],
  charityDetail: {},
})

/* Action creators */

export const getCharityList = createAction(ADMIN_GET_CHARITY_LIST)
export const createCharity = createAction(ADMIN_CREATE_CHARITY)
export const getCharityDetail = createAction(ADMIN_GET_CHARITY_DETAIL)
export const updateCharityDetail = createAction(ADMIN_UPDATE_CHARITY_DETAIL)
export const uploadCharityLogo = createAction(ADMIN_UPLOAD_CHARITY_LOGO)
export const deleteCharity = createAction(ADMIN_DELETE_CHARITY)

/* Reducer */

export default handleActions({

  /* Get charity list actions */

  [requestSuccess(ADMIN_GET_CHARITY_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityList', Immutable.fromJS(payload))
  }),

  /* Get charity detail actions */

  [requestSuccess(ADMIN_GET_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityDetail', Immutable.fromJS(payload))
  }),

  /* Update charity detail actions */

  [requestSuccess(ADMIN_UPDATE_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityDetail', Immutable.fromJS(payload))
  }),

}, initialState)
