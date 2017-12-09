import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Field, reduxForm } from 'redux-form/immutable'

import InputField from 'components/InputField'
import SelectField from 'components/SelectField'
import { pick } from 'utils/pureFunctions'


class AccountForm extends PureComponent {

  static propTypes = {
    countries: PropTypes.array.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { error, countries, handleSubmit, submitting, submitFailed, submitSucceeded } = this.props
    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to update your account settings'}
        </Alert>}

        {submitSucceeded && <Alert color="success">
          Successfully saved
        </Alert>}

        <Row>
          <Col xs={12} sm={6}>
            <Field
              name="first_name"
              type="text"
              label="First name"
              size="lg"
              component={InputField}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Field
              name="last_name"
              type="text"
              label="Last name"
              size="lg"
              component={InputField}
            />
          </Col>
        </Row>
        <Field
          name="username"
          type="text"
          label="Username"
          size="lg"
          component={InputField}
        />
        <Field
          name="phone_number"
          type="text"
          label="Phone Number:"
          size="lg"
          component={InputField}
        />
        <h4 className="mt-5 mb-4">Address</h4>
        <Row>
          <Col xs={12} sm={6}>
            <Field
              name="country"
              type="select"
              label="Country"
              size="lg"
              options={countries.map((item, index) => ({
                value: item.code,
                label: item.name
              }))}
              component={SelectField}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Field
              name="city"
              type="text"
              label="City"
              size="lg"
              component={InputField}
            />
          </Col>
        </Row>
        <Field
          name="zipcode"
          type="text"
          label="Zip / Postal Code"
          size="lg"
          component={InputField}
        />
        <Field
          name="address_line"
          type="text"
          label="Address Line"
          size="lg"
          component={InputField}
        />
        <Row className="submit-wrapper">
          <Col xs={12} md={8} />
          <Col xs={12} md={4}>
            <Button block color="primary" type="submit" size="lg" disabled={submitting}>
              Save
            </Button>
          </Col>
        </Row>
      </form>
    )
  }
}

const fieldInitialValuesSelector = (state, props) =>
  pick(props.initialValues, [
    'first_name',
    'last_name',
    'username',
    'phone_number',
    'country',
    'city',
    'zipcode',
    'address_line',
  ])

const selectors = createStructuredSelector({
  initialValues: fieldInitialValuesSelector
})

export default compose(
  connect(selectors),
  reduxForm({
    form: 'accountForm'
  })
)(AccountForm)