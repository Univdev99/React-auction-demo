import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import AppLayout1 from 'pages/AppLayout1'
import SignInForm from 'components/SignInForm'
import { signIn } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class SignIn extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    signIn: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSubmit = (data) => {
    this.props.signIn({ data })
  }

  render() {
    const { auth } = this.props
    const signInError = auth.get('signInError')

    return (
      <AppLayout1>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              <h3 className="mb-4 text-center">Sign In</h3>

              {signInError && <div className="mb-2 text-danger">
                Login failed, please enter correct username and password
              </div>}

              <SignInForm onSubmit={this.handleSubmit} />

              <center className="mt-2">
                <Link to={{ pathname: 'signup' }}>Sign Up</Link>
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
  signIn,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(SignIn)
