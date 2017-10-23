import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_GET_PRODUCT_LIST,
  ADMIN_CREATE_PRODUCT,
  ADMIN_GET_PRODUCT_DETAIL,
  ADMIN_UPDATE_PRODUCT_DETAIL,
  ADMIN_DELETE_PRODUCT,
  ADMIN_UPLOAD_PRODUCT_MEDIUM,
  ADMIN_DELETE_PRODUCT_MEDIUM,
  ADMIN_REORDER_PRODUCT_MEDIUM,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Product */
  productList: [],
  productListLoaded: false,
  productDetail: null,
  reorderedTemporaryProductMedia: null,
})

/* Action creators */

export const getProductList = createAction(ADMIN_GET_PRODUCT_LIST)
export const createProduct = createAction(ADMIN_CREATE_PRODUCT)
export const getProductDetail = createAction(ADMIN_GET_PRODUCT_DETAIL)
export const updateProductDetail = createAction(ADMIN_UPDATE_PRODUCT_DETAIL)
export const deleteProduct = createAction(ADMIN_DELETE_PRODUCT)
export const uploadProductMedium = createAction(ADMIN_UPLOAD_PRODUCT_MEDIUM)
export const deleteProductMedium = createAction(ADMIN_DELETE_PRODUCT_MEDIUM)
export const reorderProductMedia = createAction(ADMIN_REORDER_PRODUCT_MEDIUM)

/* Reducer */

export default handleActions({

  /* Get product list actions */

  [requestSuccess(ADMIN_GET_PRODUCT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('productList', Immutable.fromJS(payload))
    map.set('productListLoaded', true)
  }),

  [requestFail(ADMIN_GET_PRODUCT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('productList', Immutable.List())
    map.set('productListLoaded', false)
  }),

  /* Get product detail actions */

  [ADMIN_GET_PRODUCT_DETAIL]: (state, { payload }) => state.withMutations(map => {
    map.set('productDetail', null)
  }),

  [requestSuccess(ADMIN_GET_PRODUCT_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('productDetail', Immutable.fromJS(payload))
  }),

  /* Update product detail actions */

  [requestSuccess(ADMIN_UPDATE_PRODUCT_DETAIL)]: (state, { payload }) => state.withMutations(map => {
    map.set('productDetail', Immutable.fromJS(payload))
  }),

  /* Upload product medium actions */

  [requestSuccess(ADMIN_UPLOAD_PRODUCT_MEDIUM)]: (state, { payload }) => state.withMutations(map => {
    const productMedia = state.getIn(['productDetail', 'media'])
    map.setIn(['productDetail', 'media'], productMedia.push(Immutable.fromJS(payload)))
  }),

  /* Delete product medium actions */

  [ADMIN_DELETE_PRODUCT_MEDIUM]: (state, { payload }) => state.withMutations(map => {
    const productMedia = state.getIn(['productDetail', 'media'])
    const index = productMedia.findIndex(pm => pm.get('pk') === payload.pmId)
    if (index >= 0) {
      map.setIn(['productDetail', 'media'], productMedia.delete(index))
    }
  }),

  /* Reorder product medium actions */

  [ADMIN_REORDER_PRODUCT_MEDIUM]: (state, { payload }) => state.withMutations(map => {
    const { newMedia } = payload
    map.set('reorderedTemporaryProductMedia', newMedia)
  }),

  [requestSuccess(ADMIN_REORDER_PRODUCT_MEDIUM)]: (state, { payload }) => state.withMutations(map => {
    map.setIn(['productDetail', 'media'], Immutable.fromJS(payload))
    map.set('reorderedTemporaryProductMedia', null)
  }),

  [requestFail(ADMIN_REORDER_PRODUCT_MEDIUM)]: (state, { payload }) => state.withMutations(map => {
    map.set('reorderedTemporaryProductMedia', null)
  }),

}, initialState)
