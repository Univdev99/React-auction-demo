import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { Alert, Button, Col, Row } from 'reactstrap'
import { Field, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import InputField from 'components/InputField'

const FormField = ({ label, forModal, ...props }) => (
  <Field
    {...props}
    size="lg"
    label={forModal ? undefined : `${label}:`}
    placeholder={forModal ? label : undefined}
    component={InputField}
  />
)

class SignUpForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    forModal: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { error, handleSubmit, forModal, submitting, submitFailed } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to sign up'}
        </Alert>}

        <FormField
          name="email"
          type="email"
          label="Email"
          forModal={forModal}
        />
        {!forModal && <Row>
          <Col xs={12} md={6}>
            <FormField
              name="first_name"
              type="text"
              label="First Name"
              forModal={forModal}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              name="last_name"
              type="text"
              label="Last Name"
              forModal={forModal}
            />
          </Col>
        </Row>}
        <FormField
          name="password"
          type="password"
          label="Password"
          forModal={forModal}
        />
        <FormField 
          name="password_confirm"
          type="password"
          label="Password Confirmation"
          forModal={forModal}
        />
        <Row className={forModal ? 'mt-30' : undefined}>
          <Col xs={12} md={forModal ? undefined : { size: 4, offset: 4 }}>
            <Button type="submit" color="primary" size="lg" block disabled={submitting}>
              Sign Up
            </Button>
          </Col>
        </Row>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  const email = values.get('email')
  if (!email) {
    errors.email = 'Email address is required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    errors.email = 'Invalid email address'
  }

  const password = values.get('password')
  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 6) {
    errors.password = 'Must be at least 6 characters'
  }

  const passwordConfirm = values.get('password_confirm')
  if (password && password !== passwordConfirm) {
    errors.password_confirm = 'Password confirm does not match with entered password'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'signUpForm',
    validate,
  })
)(SignUpForm)
