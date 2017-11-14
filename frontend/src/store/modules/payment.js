import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { requestSuccess, requestFail } from 'store/api/request'
import {
  ACCOUNT_SET_PAYMENT,
  PAYMENT_TEST,
} from 'store/constants'


/* Initial state */

const initialState = Immutable.fromJS({
})

/* Action creators */

export const setPayment = createAction(ACCOUNT_SET_PAYMENT)
export const testPayment = createAction(PAYMENT_TEST)

/* Reducer */

export default handleActions({

}, initialState)
