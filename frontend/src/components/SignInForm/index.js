import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


class SignInForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    forModal: PropTypes.bool
  }

  render() {
    const { forModal, handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <FormField
          name="username"
          type="text"
          label={forModal ? undefined : 'Username or Email:'}
          placeholder={forModal ? 'Username or Email' : undefined}
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
          <Button type="submit" color="primary" block={forModal}>
            Sign In
          </Button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('username')) {
    errors.username = 'Username or email is required'
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