import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppLayout1 from 'pages/AppLayout1'
import { getCurrentUser } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class Home extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.getCurrentUser()
  }

  render() {
    /// const { auth } = this.props

    return (
      <AppLayout1>
        This is home content
      </AppLayout1>
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
  connect(selector, actions)
)(Home)
