import createHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'
import Immutable from 'immutable'
import { combineReducers } from 'redux-immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import { reducer as formReducer } from 'redux-form/immutable'
import { reducer as modal } from 'redux-modal'
import { routerMiddleware } from 'react-router-redux'

import account from 'store/modules/account'
import adminAuctions from 'store/modules/admin/auctions'
import adminCharities from 'store/modules/admin/charities'
import adminDonors from 'store/modules/admin/donors'
import adminMedia from 'store/modules/admin/media'
import adminProducts from 'store/modules/admin/products'
import adminTags from 'store/modules/admin/tags'
import adminUsers from 'store/modules/admin/users'
import auctions from 'store/modules/auctions'
import auth from 'store/modules/auth'
import authMiddleware from 'store/middlewares/auth'
import donors from 'store/modules/donors'
import jobs from 'store/modules/jobs'
import routerReducer from 'store/modules/route'
import payment from 'store/modules/payment'
import settings from 'store/modules/settings'
import sagas from 'store/sagas'


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

const enhancers = [
  applyMiddleware(...middlewares),
]

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
  /* eslint-enable */

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
  combineReducers({
    router: routerReducer,
    form: formReducer,
    auth,
    adminCharities,
    adminDonors,
    adminProducts,
    adminAuctions,
    adminTags,
    adminUsers,
    adminMedia,
    account,
    auctions,
    donors,
    jobs,
    modal,
    payment,
    settings
  }),
  Immutable.Map(),
  composeEnhancers(...enhancers)
)

sagaMiddleware.run(sagas)
