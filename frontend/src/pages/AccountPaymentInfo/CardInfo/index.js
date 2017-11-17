import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Button, Col, Input, ListGroup, ListGroupItem, Row } from 'reactstrap'


const CardInfo = ({ auth, setEditMode }) => {
  const paymentInfo = auth.getIn(['currentUser', 'payment_info'], null)

  return (
    <ListGroup>
      {paymentInfo
        ? <ListGroupItem>
          <Row>
            <Col xs={8}>
              <Input plaintext>
                <span className="font-weight-bold">
                  {paymentInfo.get('brand')}
                </span>
                {' '}**** **** **** {paymentInfo.get('last4')}
              </Input>
            </Col>
            <Col xs={4} className="text-right">
              <Button
                color="primary"
                className="pull-right"
                onClick={function() { setEditMode(true) }}
              >
                Update
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
        : <ListGroupItem>
          <Row>
            <Col xs={8}>
              <Input plaintext className="text-danger">
                No Payment Method Added
              </Input>
            </Col>
            <Col xs={4} className="text-right">
              <Button
                color="primary"
                className="pull-right"
                onClick={function() { setEditMode(true) }}
              >
                Add
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      }
    </ListGroup>
  )
}

CardInfo.propTypes = {
  auth: ImmutablePropTypes.map.isRequired,
  setEditMode: PropTypes.func.isRequired
}

export default CardInfo
