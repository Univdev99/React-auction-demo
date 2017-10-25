import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'

import { getCurrentUser } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class AdminAuthenticating extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  goToAdmin = () => {
    this.props.history.push({
      pathname: '/admin'
    })
  }

  componentWillMount() {
    const { auth } = this.props
    if (!auth.get('currentUser')) {
      this.props.getCurrentUser({
        success: this.goToAdmin
      })
    } else {
      this.goToAdmin()
    }
  }

  render() {
    return (
      <div className="container my-5">
        <center>Authenticating...</center>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  getCurrentUser,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminAuthenticating)
