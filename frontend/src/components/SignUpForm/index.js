import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormGroup from 'components/FormGroup'
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
        <FormGroup
          name="username"
          type="text"
          label="Username:"
          component={InputField}
        />
        <FormGroup
          name="email"
          type="email"
          label="Email:"
          component={InputField}
        />
        <FormGroup
          name="password"
          type="password"
          label="Password:"
          component={InputField}
        />
        <FormGroup
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

export default compose(
  reduxForm({
    form: 'signUpForm',
  })
)(SignUpForm)