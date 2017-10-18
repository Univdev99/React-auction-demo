import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
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
  loadingList: false,
  loadingListError: false,
  creating: false,
  creatingError: false,
  charityDetail: {},
  loadingDetail: false,
  loadingDetailError: false,
  updatingDetail: false,
  updatingDetailError: false,
  uploadingLogo: false,
  uploadingLogoError: false,
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

  [ADMIN_GET_CHARITY_LIST]: (state, { payload }) => state.withMutations(map => {
    map.set('loadingList', true)
    map.set('loadingListError', false)
  }),

  [requestSuccess(ADMIN_GET_CHARITY_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityList', Immutable.fromJS(payload))
    map.set('loadingList', false)
    map.set('loadingListError', false)
  }),

  [requestFail(ADMIN_GET_CHARITY_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityList', Immutable.fromJS(payload))
    map.set('loadingList', false)
    map.set('loadingListError', true)
  }),

  /* Create charity actions */

  [ADMIN_CREATE_CHARITY]: (state, { payload }) => state.withMutations(map => {
    map.set('creating', true)
    map.set('creatingError', false)
  }),

  [requestSuccess(ADMIN_CREATE_CHARITY)]: (state, { payload }) => state.withMutations(map => {
    map.set('creating', false)
    map.set('creatingError', false)
  }),

  [requestFail(ADMIN_CREATE_CHARITY)]: (state, { payload }) => state.withMutations(map => {
    map.set('creating', false)
    map.set('creatingError', true)
  }),

  /* Get charity detail actions */

  [ADMIN_GET_CHARITY_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('loadingDetail', true)
    map.set('loadingDetailError', false)
  }),

  [requestSuccess(ADMIN_GET_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityDetail', Immutable.fromJS(payload))
    map.set('loadingDetail', false)
    map.set('loadingDetailError', false)
  }),

  [requestFail(ADMIN_GET_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('loadingDetail', false)
    map.set('loadingDetailError', true)
  }),

  /* Update charity detail actions */

  [ADMIN_UPDATE_CHARITY_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('updatingDetail', true)
    map.set('updatingDetailError', false)
  }),

  [requestSuccess(ADMIN_UPDATE_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('charityDetail', Immutable.fromJS(payload))
    map.set('updatingDetail', false)
    map.set('updatingDetailError', false)
  }),

  [requestFail(ADMIN_UPDATE_CHARITY_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('updatingDetail', false)
    map.set('updatingDetailError', true)
  }),

  /* Upload charity logo actions */

  [ADMIN_UPLOAD_CHARITY_LOGO]: (state, { payload }) => state.withMutations(map => {
    map.set('uploadingLogo', true)
    map.set('uploadingLogoError', false)
  }),

  [requestSuccess(ADMIN_UPLOAD_CHARITY_LOGO)]: (state, { payload }) => state.withMutations(map => {
    map.set('uploadingLogo', false)
    map.set('uploadingLogoError', false)
  }),

  [requestFail(ADMIN_UPLOAD_CHARITY_LOGO)]: (state, { payload }) => state.withMutations(map => {
    map.set('uploadingLogo', false)
    map.set('uploadingLogoError', true)
  }),

}, initialState)
