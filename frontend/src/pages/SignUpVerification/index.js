import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
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
      fail: () => this.setState({
        status: -1
      }),
    })
  }

  render() {
    const { status } = this.state

    return (
      <FrontContainerLayout subscribe>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
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
