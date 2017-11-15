import React from 'react'

import SubscribeForm from 'components/SubscribeForm'


const SubscribeBar = () => (
  <div className="bg-secondary text-light py-4">
    <div className="container text-center">
      <span className="mr-4 mb-3 mb-sm-0 d-inline-block">
        Subscribe to our newsletter:
      </span>
      <div className="d-inline-block">
        <SubscribeForm />
      </div>
    </div>
  </div>
)

export default SubscribeBar
