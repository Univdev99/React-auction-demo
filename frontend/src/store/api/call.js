import axios from 'axios'
import { call, put } from 'redux-saga/effects'
import { get } from 'lodash'
import { requestFail, requestPending, requestSuccess } from './request'

import { BASE_API_URL } from 'config'


export default ({
  type,
  method, // one of 'get', 'post', 'put', 'delete'
  path,
  params: sagaParams,
  headers,
  success,
  fail,
  payloadOnSuccess,
  payloadOnFail
}) => function* (action) {

  const payload = action.payload || {}
  const {
    data,
    params,
    headers: customHeaders,
    success: successCallback,
    fail: failCallback,
    onUploadProgress,
    onDownloadProgress,
    resolve,
    reject
  } = payload

  try {
    yield put({
      type: requestPending(type)
    })

    const res = yield call(axios.request, {
      url: typeof path === 'function' ? path(action) : path,
      method: method.toLowerCase(),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
        ...(customHeaders ? customHeaders : {}),
      },
      data,
      params: { ...sagaParams, ...params },
      baseURL: BASE_API_URL,
      onUploadProgress,
      onDownloadProgress,
    })

    const payload = payloadOnSuccess ? payloadOnSuccess(res.data, action) : res.data
    yield put({
      type: requestSuccess(type),
      payload
    })

    if (resolve) { // Promise parameter
      yield resolve(payload);
    }

    successCallback && successCallback(res)
    success && success(res, action)

    return true

  } catch (err) {
    const errRes = get(err, 'response', err)
    const payload = payloadOnFail ? payloadOnFail(errRes, action) : errRes
    yield put({
      type: requestFail(type),
      payload
    })

    if (reject) { // Promise parameter
      yield reject(payload);
    }

    failCallback && failCallback(errRes)
    fail && fail(errRes)

    return false
  }
}
