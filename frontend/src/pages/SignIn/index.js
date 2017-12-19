import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'


import FacebookButton from 'components/FacebookButton'
import fbHandle from 'utils/fbHandle'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import Hr from 'components/Hr'
import SectionTitle from 'components/SectionTitle'
import SignInForm from 'components/SignInForm'
import { formSubmit } from 'utils/form'
import { signIn } from 'store/modules/auth'


class SignIn extends PureComponent {

  static propTypes = {
    signIn: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      signUpStatus: 0,
    }
  }

  handleSubmit = (data) => {
    const { signIn } = this.props
    return formSubmit(signIn, { data })
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

    return (
      <FrontContainerLayout subscribe>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <SectionTitle className="mb-4 text-center">Sign In</SectionTitle>

            <h4 className="mb-30 text-center">Please sign in to your account</h4>

            <SignInForm onSubmit={this.handleSubmit} />

            <h5 className="text-center mt-4 mb-0">
              <Link to={{ pathname: 'signup' }}>
                I don't have an account yet
              </Link>
            </h5>

            <Hr text="OR" />

            <div className="text-center">
              <FacebookButton disabled={!fbReady} onClick={this.handleSignUpWithFacebook}>
                Sign in with facebook
              </FacebookButton>
            </div>
          </Col>
        </Row>
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
})

const actions = {
  signIn,
}

export default compose(
  withRouter,
  fbHandle,
  connect(selector, actions),
)(SignIn)
