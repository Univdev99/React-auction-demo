import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form/immutable'

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

class SignInForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    forModal: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { error, forModal, handleSubmit, submitting, submitFailed } = this.props
    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Login failed, please enter correct email and password'}
        </Alert>}

        <FormField
          name="email"
          type="email"
          label="Email"
          forModal={forModal}
        />
        <FormField
          name="password"
          type="password"
          label="Password"
          forModal={forModal}
        />
        <Row className={forModal ? 'mt-30' : undefined}>
          <Col xs={12} md={forModal ? undefined : { size: 4, offset: 4 }}>
            <Button type="submit" color="primary" size="lg" block disabled={submitting}>
              Sign In
            </Button>
          </Col>
        </Row>
      </form>
    )
  }
}

const validate = (values, { error }) => {
  const errors = { _error: error }

  if (!values.get('email')) {
    errors.username = 'Email is required'
  }

  if (!values.get('password')) {
    errors.password = 'Password is required'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'signInForm',
    validate,
  })
)(SignInForm)
