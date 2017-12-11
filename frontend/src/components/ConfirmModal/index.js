import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Row } from 'reactstrap'
import { connectModal } from 'redux-modal'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

import { modalSelector } from 'store/selectors'


class ConfirmModal extends PureComponent {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func
  }

  handleOk = () => {
    const { handleHide, onOk } = this.props
    handleHide()
    onOk && onOk()
  }

  handleCancel = () => {
    const { handleHide, onCancel } = this.props
    handleHide()
    onCancel && onCancel()
  }

  render() {
    const { handleHide, show, text, title } = this.props

    return (
      <div>
        <Modal isOpen={show} toggle={handleHide} size="sm">
          <ModalHeader toggle={handleHide}>{title}</ModalHeader>
          <ModalBody>
            <h4 className="gb">{text}</h4>
            <Row>
              <Col xs={6}>
                <Button block onClick={this.handleOk} color="primary">Yes</Button>
              </Col>
              <Col xs={6}>
                <Button block onClick={this.handleCancel} color="secondary">No</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default connectModal({
  name: 'confirmModal',
  destroyOnHide: false,
  getModalState: modalSelector
})(ConfirmModal)
