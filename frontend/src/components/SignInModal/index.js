import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'

import auctionBidFlow from 'utils/auctionBidFlow'
import SignInForm from 'components/SignInForm'
import { signIn } from 'store/modules/auth'

class SignInModal extends PureComponent {
  static propTypes = {
    auctionId: PropTypes.number,
    handleHide: PropTypes.func.isRequired,
    startBidFlow: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    signIn: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      signInError: false
    }
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
    const { handleHide, show } = this.props
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
            <Button color="secondary" block>Sign in with Facebook</Button>
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
  signIn
}

export default compose(
  connect(null, actions),
  auctionBidFlow,
  connectModal({
    name: 'signinModal',
    destroyOnHide: false,
    getModalState: modalSelector
  })
)(SignInModal)
