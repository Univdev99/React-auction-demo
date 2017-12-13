import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { connectModal } from 'redux-modal'

import { modalSelector } from 'store/selectors'

const AuctionBidPlacedModal = ({ handleHide, show }) => (
  <div>
    <Modal isOpen={show} toggle={handleHide} size="sm">
      <ModalHeader toggle={handleHide}>Thank you!</ModalHeader>
      <ModalBody>
        <h4 className="mb-30">
          Your bid has been placed.
        </h4>
        <Button block color="primary" size="lg" onClick={handleHide}>
          Done
        </Button>
      </ModalBody>
    </Modal>
  </div>
)

AuctionBidPlacedModal.propTypes = {
  handleHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default connectModal({
  name: 'auctionBidPlacedModal',
  destroyOnHide: false,
  getModalState: modalSelector
})(AuctionBidPlacedModal)
