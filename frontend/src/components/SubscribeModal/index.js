import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connectModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'
import { reduxForm } from 'redux-form/immutable'

import SubscribeForm from 'components/SubscribeForm'
import { mailchimpSubscribe } from 'utils/form'


class SubscribeModal extends PureComponent {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  doSubmit = (data) => {
    const { handleHide } = this.props
    return mailchimpSubscribe(data.get('email')).then(() => {
      handleHide()
    })
  }

  render() {
    const { handleHide, show, subscribeForm } = this.props
    const { error, handleSubmit } = subscribeForm

    return (
      <Modal isOpen={show} toggle={handleHide} size="sm">
        <ModalHeader toggle={handleHide}>Welcome!</ModalHeader>
        <ModalBody>
          <h4 className="mb-30">Join our mailing list</h4>
          <p className="mb-30">
            We never send spam. Only valuable information once or twice per week.
          </p>
          {error && <Alert color="danger">{error}</Alert>}
          <SubscribeForm
            {...subscribeForm}
            forModal
            handleSubmit={handleSubmit(this.doSubmit)}
          />
        </ModalBody>
      </Modal>
    )
  }
}

export default compose(
  reduxForm({
    form: 'subscribeModalForm',
    propNamespace: 'subscribeForm'
  }),
  connectModal({
    name: 'subscribeModal',
    destroyOnHide: false,
    getModalState: modalSelector
  })
)(SubscribeModal)
