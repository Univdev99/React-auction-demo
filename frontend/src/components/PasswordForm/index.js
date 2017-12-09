import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form/immutable'

import InputField from 'components/InputField'


class PasswordForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { error, handleSubmit, submitFailed, submitSucceeded, submitting } = this.props
    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to update your password'}
        </Alert>}

        {submitSucceeded && <Alert color="success">
          Successfully updated password
        </Alert>}

        <Field
          name="old_password"
          type="password"
          label="Current Password"
          helpText="Must have at least 6 characters"
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;"
          size="lg"
          component={InputField}
        />
        <Field
          name="new_password"
          type="password"
          label="New Password"
          helpText="Must have at least 6 characters"
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;"
          size="lg"
          component={InputField}
        />
        <Field
          name="password_confirm"
          type="password"
          label="Confirmation New Password"
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;"
          size="lg"
          component={InputField}
        />
        <Row className="submit-wrapper">
          <Col xs={12} md={8} />
          <Col xs={12} md={4}>
            <Button block type="submit" size="lg" color="primary" disabled={submitting}>
              Save
            </Button>
          </Col>
        </Row>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  const password = values.get('new_password')
  if (password && password.length < 6) {
    errors.new_password = 'Must have at least 6 characters'
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
