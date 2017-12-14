import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'
import { reduxForm } from 'redux-form/immutable'

import SubscribeForm from 'components/SubscribeForm'
import { MAILCHIMP_TYPE_DONORS } from 'config'
import { mailchimpSubscribe } from 'utils/form'


const sanitizeError = (error) =>
  error.replace('<a', '<a class="alert-link"')

class DonateModal extends PureComponent {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  doSubmit = (data) => {
    const { handleHide, showModal } = this.props
    return mailchimpSubscribe(MAILCHIMP_TYPE_DONORS, data.get('email'))
      .then(() => {
        handleHide()
        showModal('messageModal', {
          title: 'Thank you!',
          subtitle: 'We will contact you shortly.'
        })
      })
  }

  render() {
    const { handleHide, show, donateForm } = this.props
    const { error, handleSubmit } = donateForm

    return (
      <Modal isOpen={show} toggle={handleHide} size="sm">
        <ModalHeader toggle={handleHide}>Donate</ModalHeader>
        <ModalBody>
          <h4 className="mb-30">Want to donate your stuff?</h4>
          <p className="mb-30">
            Please leave your email below and we will contact you shortly.
          </p>
          {error && <Alert color="danger">
            <div dangerouslySetInnerHTML={{ __html: sanitizeError(error) }} />
          </Alert>}
          <SubscribeForm
            {...donateForm}
            forModal
            handleSubmit={handleSubmit(this.doSubmit)}
          />
        </ModalBody>
      </Modal>
    )
  }
}

const actions = {
  showModal
}

export default compose(
  connect(null, actions),
  reduxForm({
    form: 'donateModalForm',
    propNamespace: 'donateForm'
  }),
  connectModal({
    name: 'donateModal',
    destroyOnHide: false,
    getModalState: modalSelector
  })
)(DonateModal)
