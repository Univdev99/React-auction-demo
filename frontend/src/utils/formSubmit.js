import { SubmissionError } from 'redux-form/immutable';

export default (actionCreator, payload) => {
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
