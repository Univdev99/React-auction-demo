import { List } from 'immutable'
import { SubmissionError } from 'redux-form/immutable'
import { ucFirst } from './pureFunctions'


export const formSubmit = (actionCreator, payload) => {
  return (new Promise((resolve, reject) => {
    actionCreator({ ...payload, resolve, reject })
  })).catch(res => {
    const fieldErrors = res.data || res.error
    if (typeof fieldErrors === 'object') {
      throw new SubmissionError({
        _error: fieldErrors.non_field_errors,
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
