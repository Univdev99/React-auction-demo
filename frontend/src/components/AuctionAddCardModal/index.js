import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { Elements } from 'react-stripe-elements'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

import auctionBidFlow from 'utils/auctionBidFlow'
import CardForm from 'components/CardForm'
import { authSelector } from 'store/selectors'
import { modalSelector } from 'store/selectors'
import { setPayment } from 'store/modules/payment'


class AuctionAddCardModal extends PureComponent {
  static propTypes = {
    auctionId: PropTypes.number,
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    startBidFlow: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      savingPayment: false
    }
  }

  handleSubmit = (payload) => {
    const { auctionId, handleHide, setPayment, startBidFlow } = this.props
    this.setState({
      savingPayment: true
    })

    setPayment({
      data: {
        token: payload.token.id
      },
      success: () => {
        handleHide()
        startBidFlow(auctionId)
        this.setState({
          savingPayment: false
        })
      },
      fail: () => this.setState({
        savingPayment: false
      })
    })
  }

  render() {
    const { auth, handleHide, show } = this.props
    const { savingPayment } = this.state
    const email = auth.getIn(['currentUser', 'email'], '')

    return (
      <div>
        <Modal isOpen={show} toggle={handleHide} size="sm">
          <ModalHeader toggle={handleHide}>Credit card info</ModalHeader>
          <ModalBody>
            <h4>Please enter your credit card information. No worries, it's secure.</h4>
            <Elements>
              <CardForm email={email} disabled={savingPayment} forModal onSubmit={this.handleSubmit} />
            </Elements>
          </ModalBody>
        </Modal>
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
  connect(selector, actions),
  connectModal({
    name: 'auctionAddCardModal',
    destroyOnHide: false,
    getModalState: modalSelector
  }),
  auctionBidFlow
)(AuctionAddCardModal)
