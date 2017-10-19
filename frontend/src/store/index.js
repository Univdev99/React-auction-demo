import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form/immutable'
import createSagaMiddleware from 'redux-saga'
import Immutable from 'immutable'

import routerReducer from 'store/modules/route'
import auth from 'store/modules/auth'
import adminCharities from 'store/modules/admin/charities'
import adminDonors from 'store/modules/admin/donors'
import sagas from 'store/sagas'
import authMiddleware from 'store/middlewares/auth'


// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Redux-saga middleware
const sagaMiddleware = createSagaMiddleware()

const middlewares = [
  middleware,
  sagaMiddleware,
  authMiddleware,
]

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
  combineReducers({
    router: routerReducer,
    form: formReducer,
    auth,
    adminCharities,
    adminDonors,
  }),
  Immutable.Map(),
  applyMiddleware(...middlewares)
)

sagaMiddleware.run(sagas)
