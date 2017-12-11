import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ACCOUNT_DELETE_MY_BID,
  ACCOUNT_GET_MY_BIDS
} from 'store/constants'


const getMyBids = apiCall({
  type: ACCOUNT_GET_MY_BIDS,
  method: 'get',
  path: 'account/bids/',
})

const deleteMyBid = apiCall({
  type: ACCOUNT_DELETE_MY_BID,
  method: 'delete',
  path: ({ payload }) => `account/bids/${payload.id}/`,
  payloadOnSuccess: (data, action) => ({
    ...data,
    pk: action.payload.id
  })
})

export default function* rootSaga () {
  yield takeLatest(ACCOUNT_GET_MY_BIDS, getMyBids)
  yield takeLatest(ACCOUNT_DELETE_MY_BID, deleteMyBid)
}
