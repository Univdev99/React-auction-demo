import React from 'react'
import { Container } from 'reactstrap'

import ArrowButton from 'components/ArrowButton'

const DonateBar = () => (
  <Container className="text-center">
    <div className="donate-bar">
      <div className="h2 text-primary d-md-inline-block align-middle mb-4 mb-md-0 mr-md-5">
        Donate your stuff
      </div>
      <ArrowButton className="align-middle" text="Donate" />
    </div>
  </Container>
)

export default DonateBar
