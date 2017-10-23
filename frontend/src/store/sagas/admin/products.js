import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
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


const getProductList = apiCall({
  type: ADMIN_GET_PRODUCT_LIST,
  method: 'get',
  path: 'admin/products/',
})

const createProduct = apiCall({
  type: ADMIN_CREATE_PRODUCT,
  method: 'post',
  path: 'admin/products/',
})

const getProductDetail = apiCall({
  type: ADMIN_GET_PRODUCT_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/products/${payload.id}/`,
})

const updateProductDetail = apiCall({
  type: ADMIN_UPDATE_PRODUCT_DETAIL,
  method: 'put',
  path: ({ payload }) => `admin/products/${payload.id}/`,
})

const deleteProduct = apiCall({
  type: ADMIN_DELETE_PRODUCT,
  method: 'delete',
  path: ({ payload }) => `admin/products/${payload.id}/`,
})

const uploadProductMedium = apiCall({
  type: ADMIN_UPLOAD_PRODUCT_MEDIUM,
  method: 'post',
  path: ({ payload }) => `admin/products/${payload.id}/media/`,
})

const deleteProductMedium = apiCall({
  type: ADMIN_DELETE_PRODUCT_MEDIUM,
  method: 'delete',
  path: ({ payload }) => `admin/products/${payload.id}/media/${payload.pmId}/`,
})

const reorderProductMedia = apiCall({
  type: ADMIN_REORDER_PRODUCT_MEDIUM,
  method: 'post',
  path: ({ payload }) => `admin/products/${payload.id}/media/reorder/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_PRODUCT_LIST, getProductList)
  yield takeLatest(ADMIN_CREATE_PRODUCT, createProduct)
  yield takeLatest(ADMIN_GET_PRODUCT_DETAIL, getProductDetail)
  yield takeLatest(ADMIN_UPDATE_PRODUCT_DETAIL, updateProductDetail)
  yield takeLatest(ADMIN_DELETE_PRODUCT, deleteProduct)
  yield takeLatest(ADMIN_UPLOAD_PRODUCT_MEDIUM, uploadProductMedium)
  yield takeLatest(ADMIN_DELETE_PRODUCT_MEDIUM, deleteProductMedium)
  yield takeLatest(ADMIN_REORDER_PRODUCT_MEDIUM, reorderProductMedia)
}
