import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { Link } from 'react-router-dom'
import { modalSelector } from 'store/selectors'

import auctionBidFlow from 'utils/auctionBidFlow'
import FacebookButton from 'components/FacebookButton'
import fbHandle from 'utils/fbHandle'
import Hr from 'components/Hr'
import SignUpForm from 'components/SignUpForm'
import { formSubmit } from 'utils/form'
import { signUp } from 'store/modules/auth'

class SignUpModal extends PureComponent {
  static propTypes = {
    auctionId: PropTypes.number,
    fbReady: PropTypes.bool,
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired,
    signUpWithFacebook: PropTypes.func.isRequired,
    startBidFlow: PropTypes.func.isRequired
  }

  handleSignIn = (event) => {
    const { handleHide, showModal } = this.props
    event.preventDefault()
    handleHide()
    showModal('signinModal')
  }

  handleSignUpWithFacebook = (event) => {
    const { auctionId, handleHide, signUpWithFacebook, startBidFlow } = this.props
    event.preventDefault()

    signUpWithFacebook({
      success: () => {
        handleHide()
        startBidFlow(auctionId)
      }
    })
  }

  handleSubmit = (data) => {
    const { handleHide, showModal, signUp } = this.props

    return formSubmit(signUp, {
      data,
      success: () => {
        handleHide()
        showModal('accountCreatedModal')
      }
    })
  }

  render() {
    const { fbReady, handleHide, show } = this.props

    return (
      <Modal isOpen={show} toggle={handleHide} size="sm">
        <ModalHeader toggle={handleHide}>Hello there</ModalHeader>
        <ModalBody>
          <h4 className="mb-30">Please sign up to our website</h4>
          <FacebookButton block disabled={!fbReady} onClick={this.handleSignUpWithFacebook}>
            Sign up using facebook
          </FacebookButton>
          <Hr text="OR" />
          <SignUpForm forModal onSubmit={this.handleSubmit} />
          <h5 className="text-center mt-4 mb-0">
            <Link to="/signin" onClick={this.handleSignIn}>
              I already have an account
            </Link>
          </h5>
        </ModalBody>
      </Modal>
    )
  }
}

const actions = {
  showModal,
  signUp
}

export default compose(
  connect(null, actions),
  connectModal({
    name: 'signupModal',
    destroyOnHide: false,
    getModalState: modalSelector
  }),
  auctionBidFlow,
  fbHandle
)(SignUpModal)
