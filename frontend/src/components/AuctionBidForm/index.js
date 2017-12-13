import React, { PureComponent } from 'react'
import { Alert, Button } from 'reactstrap'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import InputField from 'components/InputField'

const amountIsRequired = value => (value ? undefined : 'Amount is Required')

class AuctionBidForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  render() {
    const { error, handleSubmit, submitFailed, submitting } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to place your bid'}
        </Alert>}

        <Field
          name="price"
          type="number"
          placeholder="$"
          size="lg"
          component={InputField}
          required={[amountIsRequired]}
        />
        <div className="mt-30">
          <Button block size="lg" type="submit" color="primary" disabled={submitting}>
            Bid on this auction
          </Button>
        </div>
      </form>
    )
  }
}

export default compose(
  reduxForm({
    form: 'auctionBidForm'
  })
)(AuctionBidForm)
