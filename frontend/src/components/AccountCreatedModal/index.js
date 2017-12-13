import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { connectModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'

const AccountCreatedModal = ({ handleHide, show }) => (
  <div>
    <Modal isOpen={show} toggle={handleHide} size="sm">
      <ModalHeader toggle={handleHide}>Thank you!</ModalHeader>
      <ModalBody>
        <p className="mb-30">
          Your account has been created and the confirmation email has been sent. Please check your inbox.
        </p>
        <Button color="primary" block onClick={handleHide}>Done</Button>
      </ModalBody>
    </Modal>
  </div>
)

AccountCreatedModal.propTypes = {
  handleHide: PropTypes.func,
  show: PropTypes.bool
}

export default connectModal({
  name: 'accountCreatedModal',
  destroyOnHide: false,
  getModalState: modalSelector
})(AccountCreatedModal)
