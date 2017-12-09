import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Button, Col, Input, Row } from 'reactstrap'


const CardInfo = ({ auth, setEditMode }) => {
  const paymentInfo = auth.getIn(['currentUser', 'payment_info'], null)

  return paymentInfo ? (
    <Row>
      <Col xs={8}>
        <Input plaintext size="lg" tag="h4">
          {paymentInfo.get('brand')}
          {' '}**** **** **** {paymentInfo.get('last4')}
        </Input>
      </Col>
      <Col xs={4} className="text-right">
        <Button
          block
          color="primary"
          size="lg"
          onClick={function() { setEditMode(true) }}
        >
          Update
        </Button>
      </Col>
    </Row>
  ) : (
    <Row>
      <Col xs={8}>
        <Input plaintext size="lg" className="text-danger" tag="h4">
          No Payment Method Added
        </Input>
      </Col>
      <Col xs={4} className="text-right">
        <Button
          block
          color="primary"
          size="lg"
          onClick={function() { setEditMode(true) }}
        >
          Add
        </Button>
      </Col>
    </Row>
  )
}

CardInfo.propTypes = {
  auth: ImmutablePropTypes.map.isRequired,
  setEditMode: PropTypes.func.isRequired
}

export default CardInfo
