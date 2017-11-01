import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


class AccountForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  render() {
    const { handleSubmit, disabled } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} sm={6}>
            <FormField
              name="first_name"
              type="text"
              label="First name:"
              component={InputField}
            />
          </Col>
          <Col xs={12} sm={6}>
            <FormField
              name="last_name"
              type="text"
              label="Last name:"
              component={InputField}
            />
          </Col>
        </Row>
        <FormField
          name="username"
          type="text"
          label="Username:"
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
        />
        <FormField
          name="password_confirm"
          type="password"
          label="Password Confirmation:"
          helpText="Leave this field empty to keep current password unchanged"
          component={InputField}
        />
        <center>
          <button type="submit" className="btn btn-primary" disabled={disabled}>Update</button>
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

  const password = values.get('password')
  if (password && password.length < 6) {
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
    form: 'accountForm',
    validate,
  })
)(AccountForm)