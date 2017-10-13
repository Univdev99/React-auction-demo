import { signOut } from 'store/modules/auth'


const authMiddleware = store => next => action => {
  if (action.type.substr(action.type.length - 5) === '/fail') {
    const { status, data } = action.payload
    if (status === 401 && data.detail && data.detail === 'Error decoding signature.') {
      store.dispatch(signOut())
    }
  }
  return next(action)
}

export default authMiddleware
