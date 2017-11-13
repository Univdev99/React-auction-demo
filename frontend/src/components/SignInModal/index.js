import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'

import auctionBidFlow from 'utils/auctionBidFlow'
import fbHandle from 'utils/fbHandle'
import SignInForm from 'components/SignInForm'
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

  constructor(props) {
    super(props)
    this.state = {
      signInError: false
    }
  }

  handleSignup = () => {
    const { auctionId, handleHide, showModal } = this.props
    handleHide()
    showModal('signupModal', { auctionId })
  }

  handleSignUpWithFacebook = () => {
    const { auctionId, fbReady, handleHide, signUpWithFacebook, startBidFlow } = this.props

    if (!fbReady) {
      return
    }
    
    this.setState({
      signUpStatus: 1
    })

    signUpWithFacebook({
      success: () => {
        handleHide()
        startBidFlow(auctionId)
      },
      fail: () => this.setState({
        signUpStatus: -1
      })
    })
  }

  handleSubmit = (data) => {
    const { auctionId, handleHide, startBidFlow, signIn } = this.props
    signIn({
      data,
      success: () => {
        handleHide()
        startBidFlow(auctionId)
      },
      fail: () => this.setState({
        signInError: true
      })
    })
  }

  render() {
    const { fbReady, handleHide, show } = this.props
    const { signInError } = this.state

    return (
      <div>
        <Modal isOpen={show} toggle={handleHide} size="sm">
          <ModalHeader toggle={handleHide}>Hello there</ModalHeader>
          {signInError && <div className="mb-2 text-danger">
            Login failed, please enter correct email and password
          </div>}
          <ModalBody>
            <p>Please sign in to your account</p>
            <Button color="secondary" block disabled={!fbReady} onClick={this.handleSignUpWithFacebook}>
              Sign in with facebook
            </Button>
            <hr />
            <SignInForm forModal onSubmit={this.handleSubmit} />
            <div className="text-center">
              <Button tag="a" href="#" color="link" onClick={this.handleSignup}>
                I don't have an account yet
              </Button>
            </div>
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
