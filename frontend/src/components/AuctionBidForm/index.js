import React, { PureComponent } from 'react'
import { Button } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormField from 'components/FormField'
import InputField from 'components/InputField'

const amountIsRequired = value => (value ? undefined : 'Amount is Required')

class AuctionBidForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit}>
        <FormField
          name="price"
          type="number"
          placeholder="$"
          component={InputField}
          required={[amountIsRequired]}
        />
        <div className="text-center">
          <Button type="submit" color="primary">
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
