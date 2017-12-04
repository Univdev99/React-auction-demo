export const API_PENDING = 'pending'

export const API_SUCCESS = 'success'

export const API_FAIL = 'fail'

export const requestPending = type => `${type}/${API_PENDING}`

export const requestSuccess = type => `${type}/${API_SUCCESS}`

export const requestFail = type => `${type}/${API_FAIL}`
