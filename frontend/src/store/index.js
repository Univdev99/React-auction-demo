import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form/immutable'

// import reducers from './reducers' // Or wherever you keep your reducers

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
  combineReducers({
    // ...reducers,
    router: routerReducer,
    form: formReducer
  }),
  applyMiddleware(middleware)
)
