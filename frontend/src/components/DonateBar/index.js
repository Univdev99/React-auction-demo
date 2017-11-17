import React from 'react'
import { Button, Container } from 'reactstrap'

const DonateBar = () => (
  <div className="bg-secondary text-light py-4">
    <Container className="text-center">
      <div className="pr-sm-3 mb-3 mb-sm-0 d-sm-inline-block">
        Donate your stuff
      </div>
      <Button color="primary">Donate</Button>
    </Container>
  </div>
)

export default DonateBar
