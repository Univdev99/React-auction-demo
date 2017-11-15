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
          <h5>Join our mailing list</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <SubscribeForm />
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
