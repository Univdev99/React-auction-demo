import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


class PasswordForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { error, handleSubmit, submitFailed, submitting } = this.props
    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to update your password'}
        </Alert>}

        <FormField
          name="old_password"
          type="password"
          label="Current Password"
          helpText="Must have at least 6 characters"
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;"
          component={InputField}
        />
        <FormField
          name="new_password"
          type="password"
          label="New Password"
          helpText="Must have at least 6 characters"
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;"
          component={InputField}
        />
        <FormField
          name="password_confirm"
          type="password"
          label="Confirmation New Password"
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;"
          component={InputField}
        />
        <div className="text-right">
          <Button type="submit" color="primary" disabled={submitting}>Update</Button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  const password = values.get('new_password')
  if (password && password.length < 6) {
    errors.password = 'Must have at least 6 characters'
  }

  const passwordConfirm = values.get('password_confirm')
  if (password && password !== passwordConfirm) {
    errors.password_confirm = 'Password confirm does not match with entered password'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'changePasswordForm',
    validate,
  })
)(PasswordForm)
