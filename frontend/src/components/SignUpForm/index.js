import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


class SignUpForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  render() {
    const { handleSubmit, disabled } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <FormField
          name="username"
          type="text"
          label="Username:"
          component={InputField}
        />
        <FormField
          name="email"
          type="email"
          label="Email:"
          component={InputField}
        />
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
        <center>
          <button type="submit" className="btn btn-primary" disabled={disabled}>Sign Up</button>
        </center>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('username')) {
    errors.username = 'Username is required'
  }

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