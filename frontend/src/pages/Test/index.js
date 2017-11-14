import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Button } from 'reactstrap'
import { Elements } from 'react-stripe-elements'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import CardForm from 'components/CardForm'
import { setPayment, testPayment } from 'store/modules/payment'
import { authSelector } from 'store/selectors'


class TestPage extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    setPayment: PropTypes.func.isRequired,
    testPayment: PropTypes.func.isRequired,
  }

  state = {
    savingPayment: false
  }

  handleSubmit = (payload) => {
    this.setState({
      savingPayment: true
    })

    this.props.setPayment({
      data: {
        token: payload.token.id
      },
      success: () => this.setState({
        savingPayment: false
      }),
      fail: () => this.setState({
        savingPayment: false
      })
    })
  }

  handleTestPayment = (payload) => {
    this.props.testPayment({
      data: {
        amount: 100,
      }
    })
  }

  render() {
    const { auth } = this.props
    const email = auth.getIn(['currentUser', 'email'], '')
    const { savingPayment } = this.state

    return (
      <div>
        <div className="mb-4">
          {email}
        </div>
        <Elements>
          <CardForm email={email} onSubmit={this.handleSubmit} disabled={savingPayment} />
        </Elements>
        <Button color="primary" onClick={this.handleTestPayment}>Test</Button>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector
})

const actions = {
  setPayment,
  testPayment
}

export default compose(
  connect(selector, actions)
)(TestPage)
