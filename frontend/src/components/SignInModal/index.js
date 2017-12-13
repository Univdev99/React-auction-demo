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
import SignInForm from 'components/SignInForm'
import { formSubmit } from 'utils/form'
import { signIn } from 'store/modules/auth'

class SignInModal extends PureComponent {
  static propTypes = {
    auctionId: PropTypes.number,
    fbReady: PropTypes.bool,
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    signIn: PropTypes.func.isRequired,
    signUpWithFacebook: PropTypes.func.isRequired,
    startBidFlow: PropTypes.func.isRequired
  }

  handleSignup = (e) => {
    const { auctionId, handleHide, showModal } = this.props
    e.preventDefault()
    handleHide()
    showModal('signupModal', { auctionId })
  }

  handleSignUpWithFacebook = () => {
    const { auctionId, fbReady, handleHide, signUpWithFacebook, startBidFlow } = this.props

    if (!fbReady) {
      return
    }

    signUpWithFacebook({
      success: () => {
        handleHide()
        auctionId && startBidFlow(auctionId)
      }
    })
  }

  handleSubmit = (data) => {
    const { auctionId, handleHide, startBidFlow, signIn } = this.props
    return formSubmit(signIn, {
      data,
      success: () => {
        handleHide()
        auctionId && startBidFlow(auctionId)
      }
    })
  }

  render() {
    const { fbReady, handleHide, show } = this.props

    return (
      <div>
        <Modal isOpen={show} toggle={handleHide} size="sm">
          <ModalHeader toggle={handleHide}>Hello there</ModalHeader>
          <ModalBody>
            <h4 className="mb-30">Please sign in to your account</h4>
            <FacebookButton block disabled={!fbReady} onClick={this.handleSignUpWithFacebook}>
              Sign in with facebook
            </FacebookButton>
            <Hr text="OR" />
            <SignInForm forModal onSubmit={this.handleSubmit} />
            <h5 className="text-center mt-4 mb-0">
              <Link to="/" onClick={this.handleSignup}>
                I don't have an account yet
              </Link>
            </h5>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const actions = {
  showModal,
  signIn
}

export default compose(
  connect(null, actions),
  connectModal({
    name: 'signinModal',
    destroyOnHide: false,
    getModalState: modalSelector
  }),
  auctionBidFlow,
  fbHandle
)(SignInModal)
