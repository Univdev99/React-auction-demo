import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ADMIN_GET_PRODUCT_LIST,
  ADMIN_CREATE_PRODUCT,
  ADMIN_GET_PRODUCT_DETAIL,
  ADMIN_UPDATE_PRODUCT_DETAIL,
  ADMIN_DELETE_PRODUCT,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
  /* Product */
  productList: [],
  productListLoaded: false,
  productDetail: null,
})

/* Action creators */

export const getProductList = createAction(ADMIN_GET_PRODUCT_LIST)
export const createProduct = createAction(ADMIN_CREATE_PRODUCT)
export const getProductDetail = createAction(ADMIN_GET_PRODUCT_DETAIL)
export const updateProductDetail = createAction(ADMIN_UPDATE_PRODUCT_DETAIL)
export const deleteProduct = createAction(ADMIN_DELETE_PRODUCT)

/* Reducer */

export default handleActions({

  /* Get product list actions */

  [requestSuccess(ADMIN_GET_PRODUCT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('productList', Immutable.fromJS(payload))
    map.set('productListLoaded', true)
  }),

  [requestFail(ADMIN_GET_PRODUCT_LIST)]: (state, { payload }) => state.withMutations(map => {
    map.set('productList', Immutable.fromJS([]))
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

}, initialState)
