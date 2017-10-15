import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppLayout1 from 'pages/AppLayout1'
import SignUpForm from 'components/SignUpForm'
import { signUp } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class SignUp extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    signUp: PropTypes.func.isRequired,
  }

  handleSubmit = (data) => {
    this.props.signUp({ data })
  }

  render() {
    const { auth } = this.props
    const signUpError = auth.get('signUpError')

    return (
      <AppLayout1>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              {signUpError && <div className="mb-2 text-danger">
                Failed to sign up
              </div>}

              <SignUpForm onSubmit={this.handleSubmit} />

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
  signUp,
}

export default compose(
  connect(selector, actions)
)(SignUp)
