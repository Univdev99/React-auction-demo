import React, { PureComponent } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import { Alert, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { Cookies, withCookies } from 'react-cookie';
import { modalSelector } from 'store/selectors'
import { reduxForm } from 'redux-form/immutable'

import SubscribeForm from 'components/SubscribeForm'
import { MAILCHIMP_TYPE_NEWSLETTER } from 'config'
import { mailchimpSubscribe } from 'utils/form'


const sanitizeError = (error) =>
  error.replace('<a', '<a class="alert-link"')

class SubscribeModal extends PureComponent {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  handleHide = () => {
    const { cookies, handleHide } = this.props
    cookies.set('hideSubscribeModal', 'true', {
      maxAge: 30 * 24 * 3600
    })
    handleHide()
  }

  doSubmit = (data) => {
    const { showModal } = this.props
    return mailchimpSubscribe(MAILCHIMP_TYPE_NEWSLETTER, data.get('email'))
      .then(() => {
        this.handleHide()
        showModal('messageModal', {
          title: 'Thank you!',
          subtitle: 'Successfully subscribed to our newsletter'
        })
      })
  }

  render() {
    const { show, subscribeForm } = this.props
    const { error, handleSubmit } = subscribeForm

    return (
      <Modal isOpen={show} toggle={this.handleHide} size="sm">
        <ModalHeader toggle={this.handleHide}>Welcome!</ModalHeader>
        <ModalBody> 
          <h4 className="mb-30">Join our mailing list</h4>
          <p className="mb-30">
            We never send spam. Only valuable information once or twice per week.
          </p>
          {error && <Alert color="danger">
            <div dangerouslySetInnerHTML={{ __html: sanitizeError(error) }} />
          </Alert>}
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

const actions = {
  showModal
}

export default compose(
  withCookies,
  connect(null, actions),
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
