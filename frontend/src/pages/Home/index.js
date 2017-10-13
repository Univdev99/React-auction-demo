import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
import AppLayout1 from 'pages/AppLayout1'

import { getCurrentUser } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class Home extends PureComponent {
  componentWillMount() {
    this.props.getCurrentUser()
  }

  render() {
    const { auth } = this.props
    const userLoaded = auth.get('userLoaded')

    if (userLoaded) {
      return (
        <AppLayout1>
          This is home content
        </AppLayout1>
      )
    } else {
      return <Spinner />
    }
  }
}

Home.propTypes = {
  auth: ImmutablePropTypes.map.isRequired,
  getCurrentUser: PropTypes.func.isRequired,
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
