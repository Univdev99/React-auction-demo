import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { Alert, Button, Row, Col } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import DateTimeField from 'components/DateTimeField'


class AuctionStartForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  handleClickBack = (e) => {
    e.preventDefault()

    const { onBack } = this.props
    if (onBack) {
      onBack()
    }
  }

  render() {
    const { error, handleSubmit, onBack, submitFailed, submitting } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to start the auction'}
        </Alert>}

        <div className="bordered-box no-bottom-padding">
          <FormField
            name="open_until"
            label="Auction Open Until"
            component={DateTimeField}
          />
          <Row>
            <Col md={4} xs={12}>
              <FormField
                name="duration_days"
                type="number"
                label="Duration (days)"
                component={InputField}
              />
            </Col>
            <Col md={4} xs={12}>
              <FormField
                name="duration_hours"
                type="number"
                label="Duration (hours)"
                component={InputField}
              />
            </Col>
            <Col md={4} xs={12}>
              <FormField
                name="duration_minutes"
                type="number"
                label="Duration (minutes)"
                component={InputField}
              />
            </Col>
          </Row>
        </div>

        <div className="mt-4 text-right">
          {onBack && <Button className="mr-3" onClick={this.handleClickBack}>
            Cancel
          </Button>}
          <Button type="submit" color="primary" disabled={submitting}>
            Start Auction
          </Button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (
    !values.get('open_until') &&
    !values.get('duration_days') &&
    !values.get('duration_hours') &&
    !values.get('duration_minutes')
  ) {
    errors.open_until = 'Please fill either \'Open Until\' field or \'Duration fields\''
    errors.duration_days = 'Please fill either \'Open Until\' field or \'Duration fields\''
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'auctionStartForm',
    validate,
  })
)(AuctionStartForm)
