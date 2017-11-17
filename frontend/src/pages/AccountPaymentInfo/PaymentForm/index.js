import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Elements } from 'react-stripe-elements'

import CardForm from 'components/CardForm'


class PaymentForm extends PureComponent {
  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    setEditMode: PropTypes.func.isRequired,
    setPayment: PropTypes.func.isRequried
  }

  constructor(props) {
    super(props)
    this.state = {
      savingPayment: false
    }
  }

  handleSubmit = (payload) => {
    const { setEditMode, setPayment } = this.props
    this.setState({
      savingPayment: true
    })

    setPayment({
      data: {
        token: payload.token.id
      },
      success: () => {
        this.setState({
          savingPayment: false
        })
        setEditMode(false)
      },
      fail: () => {
        this.setState({
          savingPayment: false
        })
        setEditMode(false)
      }
    })
  }

  render() {
    const { auth } = this.props
    const { savingPayment } = this.state
    const email = auth.getIn(['currentUser', 'email'], '')

    return (
      <div className="mt-4">
        <Elements>
          <CardForm email={email} disabled={savingPayment} onSubmit={this.handleSubmit} />
        </Elements>
      </div>
    )
  }
}

export default PaymentForm
