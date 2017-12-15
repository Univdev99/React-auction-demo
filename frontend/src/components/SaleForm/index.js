import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { Alert, Button, Row, Col } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import FormField from 'components/FormField'
import DateTimeField from 'components/DateTimeField'
import InputField from 'components/InputField'
import { SALE_STATUS_CHOICES } from 'config'


class SaleForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: ImmutablePropTypes.map,
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
    const { error, handleSubmit, initialValues, onBack, submitFailed, submitting } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || `Failed to ${initialValues.get('title') ? 'update the' : 'create a'} sale`}
        </Alert>}

        <div className="bordered-box no-bottom-padding">
          <Row>
            <Col md={6} xs={12}>
              <FormField
                name="item_sent"
                label="Item sent at:"
                component={DateTimeField}
              />
            </Col>
            <Col md={6} xs={12}>
              <FormField
                name="tracking_number"
                label="Tracking number:"
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4} xs={12}>
              <FormField
                name="cheque_sent_at"
                label="Cheque sent to charity at:"
                component={DateTimeField}
              />
            </Col>
            <Col md={4} xs={12}>
              <FormField
                name="receipt_received_at"
                label="Receipt received from charity at:"
                component={DateTimeField}
              />
            </Col>
            <Col md={4} xs={12}>
              <FormField
                name="status"
                label="Status:"
                type="select"
                component={InputField}
                options={SALE_STATUS_CHOICES}
              />
            </Col>
          </Row>
        </div>

        <div className="text-right mt-4">
          {onBack && <Button className="mr-3 px-4" onClick={this.handleClickBack}>
            Back
          </Button>}
          <Button type="submit" color="primary" className="px-4" disabled={submitting}>
            Update
          </Button>
        </div>
      </form>
    )
  }
}

export default compose(
  reduxForm({
    form: 'saleForm',
  })
)(SaleForm)
