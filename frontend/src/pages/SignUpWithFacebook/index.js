import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import AppLayout1 from 'pages/AppLayout1'
import SignUpWithFacebookForm from 'components/SignUpWithFacebookForm'
import { signUpWithFacebook } from 'store/modules/auth'


class SignUpWithFacebook extends PureComponent {

  static propTypes = {
    signUpWithFacebook: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    signUpStatus: 0
  }

  handleSubmit = (formData) => {
    this.setState({
      signUpStatus: 1
    })

    const data = formData.set('access_token', this.props.match.params.access_token)

    this.props.signUpWithFacebook({
      data,
      success: () => this.setState({
        signUpStatus: 10
      }),
      fail: () => this.setState({
        signUpStatus: -1
      }),
    })
  }

  render() {
    const { signUpStatus } = this.state

    return (
      <AppLayout1>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              {
                signUpStatus === 10 ?
                <center>
                  You've successfully signed up with your Facebook account.<br />
                  <Link to="/signin">Please click here to sign in</Link>
                </center>
                :
                <div>
                  <h3 className="mb-4 text-center">Sign Up With Facebook</h3>

                  {signUpStatus === -1 && <div className="mb-2 text-danger">
                    Failed to sign up with Facebook
                  </div>}

                  <SignUpWithFacebookForm onSubmit={this.handleSubmit} disabled={signUpStatus === 1} />
                </div>
              }
            </div>
          </div>
        </div>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
})

const actions = {
  signUpWithFacebook,
}

export default compose(
  connect(selector, actions)
)(SignUpWithFacebook)
