import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'

import AuctionBidForm from 'components/AuctionBidForm'
import { formSubmit } from 'utils/form'
import { placeBid } from 'store/modules/auctions'

class AuctionBidModal extends PureComponent {
  static propTypes = {
    auctionId: PropTypes.number,
    handleHide: PropTypes.func.isRequired,
    placeBid: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired
  }

  handleSubmit = (data) => {
    const { auctionId, handleHide, placeBid, showModal } = this.props

    return formSubmit(placeBid, {
      id: auctionId,
      data: {
        price: parseInt(data.get('price'), 10)
      },
      success: () => {
        handleHide()
        showModal('auctionBidPlacedModal')
      }
    })
  }

  render() {
    const { handleHide, show } = this.props

    return (
      <div>
        <Modal isOpen={show} toggle={handleHide} size="sm">
          <ModalHeader toggle={handleHide}>Are you sure?</ModalHeader>
          <ModalBody>
            <h4 className="mb-30">
              Your credit card won't be charged now. Only if you win the auction.
            </h4>
            <AuctionBidForm onSubmit={this.handleSubmit} />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const actions = {
  placeBid,
  showModal
}

export default compose(
  connect(null, actions),
  connectModal({
    name: 'auctionBidModal',
    destroyOnHide: false,
    getModalState: modalSelector
  })
)(AuctionBidModal)
