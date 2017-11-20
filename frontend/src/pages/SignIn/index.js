import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import { formSubmit } from 'utils/form'
import SignInForm from 'components/SignInForm'
import { signIn } from 'store/modules/auth'


class SignIn extends PureComponent {

  static propTypes = {
    signIn: PropTypes.func.isRequired
  }

  handleSubmit = (data) => {
    const { signIn } = this.props
    return formSubmit(signIn, { data })
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          <h3 className="mb-4 text-center">Sign In</h3>

          <SignInForm onSubmit={this.handleSubmit} />

          <center className="mt-2">
            <Link to={{ pathname: 'signup' }}>Sign Up</Link>
          </center>

        </div>
      </div>
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
