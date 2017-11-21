import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import FrontContainerLayout from 'layouts/FrontContainerLayout'
import SignInForm from 'components/SignInForm'
import { formSubmit } from 'utils/form'
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
      <FrontContainerLayout subscribe>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>

            <h3 className="mb-4 text-center">Sign In</h3>

            <SignInForm onSubmit={this.handleSubmit} />

            <div className="text-center mt-2">
              <Link to={{ pathname: 'signup' }}>Sign Up</Link>
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
  connect(selector, actions),
)(SignIn)
