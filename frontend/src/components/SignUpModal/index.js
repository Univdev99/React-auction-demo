import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { modalSelector } from 'store/selectors'

import SignUpForm from 'components/SignUpForm'
import { signUp } from 'store/modules/auth'

class SignUpModal extends PureComponent {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      signUpError: false
    }
  }

  handleSignIn = () => {
    const { handleHide, showModal } = this.props
    handleHide()
    showModal('signinModal')
  }

  handleSubmit = (data) => {
    const { handleHide, showModal, signUp } = this.props
    signUp({
      data,
      success: () => {
        handleHide()
        showModal('accountCreatedModal')
      },
      fail: () => this.setState({
        signUpError: true
      })
    })
  }

  render() {
    const { handleHide, show } = this.props
    const { signUpError } = this.state

    return (
      <Modal isOpen={show} toggle={handleHide} size="sm">
        <ModalHeader toggle={handleHide}>Hello there</ModalHeader>
        {signUpError && <div className="mb-2 text-danger">
          Failed to sign up
        </div>}
        <ModalBody>
          <p>Please sign up to our website</p>
          <Button color="secondary" block>Sign up using facebook</Button>
          <hr />
          <SignUpForm forModal onSubmit={this.handleSubmit} simple />
          <div className="text-center">
            <Button tag="a" href="#" color="link" onClick={this.handleSignIn}>
              I already have an account
            </Button>
          </div>
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
  })
)(SignUpModal)
