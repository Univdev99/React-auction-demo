import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import CardInfo from './CardInfo'
import PaymentForm from './PaymentForm'
import SectionTitle from 'components/SectionTitle'
import { authSelector } from 'store/selectors'
import { setPayment } from 'store/modules/payment'


class AccountPaymentInfo extends PureComponent {
  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    setPayment: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
  }

  handleSetEditMode = (editMode) => {
    this.setState({ editMode });
  }

  render() {
    const { props } = this
    const { editMode } = this.state

    return (
      <div>
        <SectionTitle className="mb-4">Payment Information</SectionTitle>
        {editMode
          ? <PaymentForm {...props} setEditMode={this.handleSetEditMode} />
          : <CardInfo {...props} setEditMode={this.handleSetEditMode} />
        }
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector
})

const actions = {
  setPayment
}

export default compose(
  connect(selector, actions)
)(AccountPaymentInfo)
