import jsonp from 'jsonp'
import { List } from 'immutable'
import { SubmissionError } from 'redux-form/immutable'

import { MAILCHIMP_SUBSCRIBE_URL } from 'config'
import { ucFirst } from './pureFunctions'


export const formSubmit = (actionCreator, payload) => {
  return (new Promise((resolve, reject) => {
    actionCreator({ ...payload, resolve, reject })
  })).catch(res => {
    const fieldErrors = res.data || res.error
    if (typeof fieldErrors === 'object') {
      const globalErrors = [
        ...fieldErrors.non_field_errors || [],
        ...fieldErrors.detail || []
      ];
      throw new SubmissionError({
        _error: globalErrors.length ? globalErrors : undefined,
        ...fieldErrors
      })
    } else {
      throw new SubmissionError({
        _error: 'Internal Server Error',
      })
    }
  })
}

export const sanitizeFormError = (error) =>
  error && (
    error.constructor === Array || List.isList(error)
      ? error.map((item) => ucFirst(item))
      : ucFirst(error)
  )

export const mailchimpSubscribe = (email) => {
  const url = MAILCHIMP_SUBSCRIBE_URL + `&EMAIL=${encodeURIComponent(email)}`
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: "c"
    }, (err, data) => {
      if (data.result === "error") {
        reject({
          _error: data.msg,
        })
      } else {
        resolve()
      }
    })
  }).catch((err) => {
    throw new SubmissionError(err)
  })
}
