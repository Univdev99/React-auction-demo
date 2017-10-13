import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import SignInForm from 'components/SignInForm'

import {
  signIn,
} from 'store/modules/auth'
import {
  authSelector
} from 'store/selectors'


class SignIn extends PureComponent {
  handleSubmit = (data) => {
    this.props.signIn({ data })
  }

  render() {
    const { auth } = this.props
    const signInError = auth.get('error')

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            {signInError && <div className="mb-2 text-danger">
              Login failed, please enter correct username and password
            </div>}

            <SignInForm onSubmit={this.handleSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

SignIn.propTypes = {
  auth: ImmutablePropTypes.map.isRequired,
  signIn: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  auth: authSelector
})

const actions = {
  signIn,
}

export default compose(
  connect(selector, actions)
)(SignIn)