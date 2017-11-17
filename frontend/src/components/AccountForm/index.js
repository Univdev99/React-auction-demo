import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


class AccountForm extends PureComponent {

  static propTypes = {
    countries: PropTypes.array.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { error, countries, handleSubmit, submitting, submitFailed } = this.props
    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to update your account settings'}
        </Alert>}

        <Row>
          <Col xs={12} sm={6}>
            <FormField
              name="first_name"
              type="text"
              label="First name"
              component={InputField}
            />
          </Col>
          <Col xs={12} sm={6}>
            <FormField
              name="last_name"
              type="text"
              label="Last name"
              component={InputField}
            />
          </Col>
        </Row>
        <FormField
          name="username"
          type="text"
          label="Username"
          component={InputField}
        />
        {/*<FormField
          name="email"
          type="email"
          label="Email:"
          component={InputField}
        />*/}
        <FormField
          name="phone_number"
          type="text"
          label="Phone Number:"
          component={InputField}
        />
        <h4 className="mt-5 mb-4">Address</h4>
        <Row>
          <Col xs={12} sm={6}>
            <FormField
              name="country"
              type="select"
              label="Country"
              component={InputField}
            >
              <option value="">-- Select a Country --</option>
              {countries.map((item, index) => (
                <option key={index} value={item.code}>{item.name}</option>
              ))}
            </FormField>
          </Col>
          <Col xs={12} sm={6}>
            <FormField
              name="city"
              type="text"
              label="City"
              component={InputField}
            />
          </Col>
        </Row>
        <FormField
          name="zipcode"
          type="text"
          label="Zip / Postal Code"
          component={InputField}
        />
        <FormField
          name="address_line"
          type="text"
          label="Address Line"
          component={InputField}
        />
        <div className="text-right">
          <Button color="primary" type="submit" disabled={submitting}>Update</Button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

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