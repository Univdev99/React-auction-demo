import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import AppLayout1 from 'pages/AppLayout1'
import {
  verifySignUp,
  SIGNUP_VERIFICATION_IN_PROGRESS,
  SIGNUP_VERIFICATION_SUCCESSFUL,
  SIGNUP_VERIFICATION_FAILED,
} from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class SignUpVerification extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    verifySignUp: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  handleSubmit = (data) => {
    this.props.signIn({ data })
  }

  componentWillMount() {
    this.props.verifySignUp({
      data: { token: this.props.match.params.token }
    })
  }

  render() {
    const { auth } = this.props
    const status = auth.get('signUpVerificationStatus')

    return (
      <AppLayout1>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <center>
                {status === SIGNUP_VERIFICATION_IN_PROGRESS && <div>
                    Verifying account...
                </div>}
                {status === SIGNUP_VERIFICATION_SUCCESSFUL && <div>
                    Your account is now verified, please sign in with the new account.<br/>
                    <Link to="/signin">Please click here to Sign in.</Link>
                </div>}
                {status === SIGNUP_VERIFICATION_FAILED && <div>
                    Account verification failed.
                </div>}
              </center>
            </div>
          </div>
        </div>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  verifySignUp,
}

export default compose(
  connect(selector, actions)
)(SignUpVerification)
