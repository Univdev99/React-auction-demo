import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Button } from 'reactstrap'
import { Elements } from 'react-stripe-elements'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppLayout1 from 'pages/AppLayout1'
import CardForm from 'components/CardForm'
import { testPayment } from 'store/modules/payment'
import { authSelector } from 'store/selectors'


class TestPage extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    testPayment: PropTypes.func.isRequired,
  }

  handleSubmit = (payload) => {
    this.props.testPayment({
      data: {
        amount: 100,
      }
    })
  }

  render() {
    const { auth } = this.props
    const email = auth.getIn(['currentUser', 'email'], '')

    return (
      <AppLayout1>
        <Container className="my-5">
          <div className="mb-4">
            {email}
          </div>
          <Elements>
            <CardForm email={email} onSubmit={this.handleSubmit} />
          </Elements>
          <Button color="primary" onClick={this.handleSubmit}>Test</Button>
        </Container>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector
})

const actions = {
  testPayment
}

export default compose(
  connect(selector, actions)
)(TestPage)
