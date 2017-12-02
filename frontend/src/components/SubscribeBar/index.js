import React from 'react'
import { Col, Container, Row } from 'reactstrap'

import SubscribeForm from 'components/SubscribeForm'


const COMPONENT_CLASS = 'subscribe-bar'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const SubscribeBar = () => (
  <div className={COMPONENT_CLASS}>
    <Container className="text-center">
      <Row className="align-items-center">
        <Col xl={5} lg={6} xs={12} className="mb-3 mb-lg-0">
          <h4 className={bem('text')}>
            Subscribe to our newsletter
          </h4>
        </Col>
        <Col xl={7} lg={6} xs={12}>
          <div className="ml-auto">
            <SubscribeForm />
          </div>
        </Col>
      </Row>
    </Container>
  </div>
)

export default SubscribeBar
