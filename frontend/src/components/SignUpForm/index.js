import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { Alert, Col, Row } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


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
          label="Email:"
          component={InputField}
        />
        {!forModal && <Row>
          <Col xs={12} md={6}>
            <FormField
              name="first_name"
              type="text"
              label="First Name:"
              component={InputField}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              name="last_name"
              type="text"
              label="Last Name:"
              component={InputField}
            />
          </Col>
        </Row>}
        <FormField
          name="password"
          type="password"
          label="Password:"
          component={InputField}
        />
        <FormField
          name="password_confirm"
          type="password"
          label="Password Confirmation:"
          component={InputField}
        />
        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            Sign Up
          </button>
        </div>
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
