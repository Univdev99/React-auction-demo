import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import AppContainerLayout from 'components/AppContainerLayout'
import AppLayout1 from 'pages/AppLayout1'
import SignInForm from 'components/SignInForm'
import { signIn } from 'store/modules/auth'


class SignIn extends PureComponent {

  static propTypes = {
    signIn: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    signInError: false,
  }

  handleSubmit = (data) => {
    this.props.signIn({
      data,
      fail: () => this.setState({
        signInError: true
      })
    })
  }

  render() {
    const { signInError } = this.state

    return (
      <AppLayout1>
        <AppContainerLayout>
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              <h3 className="mb-4 text-center">Sign In</h3>

              {signInError && <div className="mb-2 text-danger">
                Login failed, please enter correct email and password
              </div>}

              <SignInForm onSubmit={this.handleSubmit} />

              <center className="mt-2">
                <Link to={{ pathname: 'signup' }}>Sign Up</Link>
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
  signIn,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(SignIn)
