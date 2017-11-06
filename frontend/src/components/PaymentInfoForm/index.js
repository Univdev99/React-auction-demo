import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form/immutable'

import MaskedInputField from 'components/MaskedInputField'


class PaymentInfoForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  render() {
    const { handleSubmit, disabled } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="ccn"
          type="text"
          mask="1111 1111 1111 1111"
          label="Credit Card Number"
          component={MaskedInputField}
        />
        <Row>
          <Col xs={8}>
            <Field
              name="exp"
              mask="11/11"
              label="Expiration"
              placeholder="MM/YY"
              component={MaskedInputField}
            />
          </Col>
          <Col xs={4}>
            <Field
              name="cvc"
              mask="111"
              label="CVC"
              component={MaskedInputField}
            />
          </Col>
        </Row>
        <div className="text-right">
          <button type="submit" className="btn btn-primary" disabled={disabled}>Submit</button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (values.get('ccn')) {
    const exp = values.get('exp')
    const cvc = values.get('cvc')
    if (!exp) {
      errors.exp = 'Expiration Date is required'
    }
    if (!cvc) {
      errors.cvc = 'CVC is required'
    }
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'paymentInfoForm',
    validate
  })
)(PaymentInfoForm)
