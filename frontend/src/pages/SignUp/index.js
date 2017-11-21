import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import fbHandle from 'utils/fbHandle'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import SignUpForm from 'components/SignUpForm'
import { formSubmit } from 'utils/form'
import { signUp } from 'store/modules/auth'

class SignUp extends PureComponent {

  static propTypes = {
    fbReady: PropTypes.bool,
    signUp: PropTypes.func.isRequired,
    signUpWithFacebook: PropTypes.func.isRequired
  }

  state = {
    signUpStatus: 0,
  }

  handleSubmit = (data) => {
    const { signUp } = this.props

    this.setState({
      signUpStatus: 1
    })

    return formSubmit(signUp, {
      data,
      success: () => this.setState({
        signUpStatus: 10
      }),
    })
  }

  handleSignUpWithFacebook = (event) => {
    const { fbReady, signUpWithFacebook } = this.props
    event.preventDefault()

    if (!fbReady) {
      return
    }
    
    this.setState({
      signUpStatus: 1
    })

    signUpWithFacebook({
      success: () => this.setState({
        signUpStatus: 10
      }),
      fail: () => this.setState({
        signUpStatus: -1
      })
    })
  }

  render() {
    const { fbReady } = this.props
    const { signUpStatus } = this.state

    return (
      <FrontContainerLayout subscribe>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            {
              signUpStatus === 10 ?
              <center>
                You've successfully signed up a new account. Please check your email for account verification.
              </center>
              :
              <div>
                <h3 className="mb-4 text-center">Sign Up</h3>

                <SignUpForm onSubmit={this.handleSubmit} />

                <div className="text-center mt-2">
                  <a className={fbReady ? '' : 'text-muted'} href="/" onClick={this.handleSignUpWithFacebook}>
                    Sign Up With Facebook
                  </a>
                </div>

              </div>
            }
          </Col>
        </Row>
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
})

const actions = {
  signUp
}

export default compose(
  fbHandle,
  connect(selector, actions)
)(SignUp)
