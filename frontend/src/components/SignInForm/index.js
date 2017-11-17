import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


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
          label={forModal ? undefined : 'Email:'}
          placeholder={forModal ? 'Email' : undefined}
          component={InputField}
        />
        <FormField
          name="password"
          type="password"
          label={forModal ? undefined : 'Password:'}
          placeholder={forModal ? 'Password' : undefined}
          component={InputField}
        />
        <div className="text-center">
          <Button type="submit" color="primary" block={forModal} disabled={submitting}>
            Sign In
          </Button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

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
