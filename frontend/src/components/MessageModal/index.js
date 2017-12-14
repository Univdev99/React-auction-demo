import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { connectModal } from 'redux-modal'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

import { modalSelector } from 'store/selectors'


const MessageModal = ({ handleHide, show, subtitle, text, title }) => (
  <div>
    <Modal isOpen={show} toggle={handleHide} size="sm">
      <ModalHeader toggle={handleHide}>{title}</ModalHeader>
      <ModalBody>
        {subtitle && <h4 className="gb">{subtitle}</h4>}
        {text && <p className="gb" dangerouslySetInnerHTML={{ __html: text }} />}
        <Button block onClick={handleHide} color="primary">OK</Button>
      </ModalBody>
    </Modal>
  </div>
)

MessageModal.propTypes = {
  handleHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  title: PropTypes.string
}

export default connectModal({
  name: 'messageModal',
  destroyOnHide: false,
  getModalState: modalSelector
})(MessageModal)
