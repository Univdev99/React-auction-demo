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
        <p>Your bid has been placed.</p>
        <Button block color="primary" onClick={handleHide}>Done</Button>
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
