import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import AppContainerLayout from 'components/AppContainerLayout'
import AppLayout1 from 'pages/AppLayout1'
import {
  verifySignUp,
} from 'store/modules/auth'


class SignUpVerification extends PureComponent {

  static propTypes = {
    verifySignUp: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    status: 1
  }

  componentDidMount() {
    this.props.verifySignUp({
      data: { token: this.props.match.params.token },
      success: () => this.setState({
        status: 10
      }),
      fail: () => this.setState({
        status: -1
      }),
    })
  }

  render() {
    const { status } = this.state

    return (
      <AppLayout1>
        <AppContainerLayout>
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <center>
                {status === 1 && <div>
                    Verifying account...
                </div>}
                {status === 10 && <div>
                    Your account is now verified, please sign in with the new account.<br/>
                    <Link to="/signin">Please click here to Sign in.</Link>
                </div>}
                {status === -1 && <div>
                    Account verification failed.
                </div>}
              </center>
            </div>
          </div>
        </AppContainerLayout>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
})

const actions = {
  verifySignUp,
}

export default compose(
  connect(selector, actions)
)(SignUpVerification)
