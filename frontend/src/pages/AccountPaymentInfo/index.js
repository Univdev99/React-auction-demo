import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
// import ImmutablePropTypes from 'react-immutable-proptypes'

import PaymentInfoForm from 'components/PaymentInfoForm'


class AccountPaymentInfo extends PureComponent {
  handleSubmit = (values) => {

  }

  render() {
    return (
      <div>

        <h3 className="mb-4">Payment Information</h3>

        <PaymentInfoForm
          onSubmit={this.handleSubmit}
        />

      </div>
    )
  }
}

export default AccountPaymentInfo
