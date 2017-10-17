import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


class UserProfileForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  validatePassword = (value) => value && value.length < 6 ?
    'Must be at least 6 characters' :
    undefined

  validatePasswordConfirm = (value, allValues) => {
    const password = allValues.get('password')
    return (value || password) && value !== password ?
      'Password confirm does not match with entered password' :
      undefined
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
          name="first_name"
          type="text"
          label="First name:"
          component={InputField}
        />
        <FormField
          name="last_name"
          type="text"
          label="Last name:"
          component={InputField}
        />
        {/*<FormField
          name="email"
          type="email"
          label="Email:"
          component={InputField}
        />*/}
        <FormField
          name="password"
          type="password"
          label="Password:"
          helpText="Leave this field empty to keep current password unchanged"
          component={InputField}
          validate={this.validatePassword}
        />
        <FormField
          name="password_confirm"
          type="password"
          label="Password Confirmation:"
          helpText="Leave this field empty to keep current password unchanged"
          component={InputField}
          validate={this.validatePasswordConfirm}
        />
        <center>
          <button type="submit" className="btn btn-primary" disabled={disabled}>Update</button>
        </center>
      </form>
    )
  }
}

export default compose(
  reduxForm({
    form: 'userProfileForm',
  })
)(UserProfileForm)