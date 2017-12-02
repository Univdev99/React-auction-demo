import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { connectModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'

import SubscribeForm from 'components/SubscribeForm'


class SubscribeModal extends PureComponent {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  render() {
    const { handleHide, show } = this.props

    return (
      <Modal isOpen={show} toggle={handleHide} size="sm">
        <ModalHeader toggle={handleHide}>Welcome!</ModalHeader>
        <ModalBody>
          <h4 className="mb-4 pb-1">Join our mailing list</h4>
          <p className="mb-4 pb-1">
            We never send spam. Only valuable information once or twice per week.
          </p>
          <SubscribeForm forModal />
        </ModalBody>
      </Modal>
    )
  }
}

export default connectModal({
  name: 'subscribeModal',
  destroyOnHide: false,
  getModalState: modalSelector
})(SubscribeModal)
