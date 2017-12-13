import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'

import FrontContainerLayout from 'layouts/FrontContainerLayout'
import { verifySignUp } from 'store/modules/auth'


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
      fail: ({ data }) => this.setState({
        status: -1,
        error: data.detail
      }),
    })
  }

  render() {
    const { status, error } = this.state

    return (
      <FrontContainerLayout subscribe>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} className="text-center">
            {status === 1 && <h4>
              Verifying account...
            </h4>}
            {status === 10 && <Alert color="success">
              Your account is now verified, please sign in with the new account.<br/>
              <Link to="/signin" className="alert-link">Please click here to Sign in.</Link>
            </Alert>}
            {status === -1 && <Alert color="danger">
              {error || 'Account verification failed.'}
            </Alert>}
          </Col>
        </Row>
      </FrontContainerLayout>
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
