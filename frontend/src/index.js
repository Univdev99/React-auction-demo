import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie';
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import axios from 'axios'

import { store, history } from 'store'
import Routes from 'routes'

import 'utils/localstorage-polyfill'
import { loadData } from 'utils/storage'
import { INTL, STRIPE_PUBLIC_KEY } from 'config'
import registerServiceWorker from './registerServiceWorker'

import './index.css'


/* Set up axios request interceptor for adding authorization header */
axios.interceptors.request.use((config) => {
  const { token } = loadData()
  if (token) {
    config.headers['Authorization'] = `JWT ${token}`
  }
  return config
})

/* Render app components */

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider {...INTL}>
      <StripeProvider apiKey={STRIPE_PUBLIC_KEY}>
        <CookiesProvider>
          <Routes history={history} />
        </CookiesProvider>
      </StripeProvider>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
