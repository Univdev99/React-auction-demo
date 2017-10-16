import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'

import Spinner from 'components/Spinner'
import { getCurrentUser } from 'store/modules/auth'
import { signOut } from 'store/modules/auth'
import { authSelector } from 'store/selectors'
import './style.css'


class AdminLayout extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSignOut = () => {
    this.props.signOut()
  }

  componentWillMount() {
    this.props.getCurrentUser()
  }

  componentWillReceiveProps(nextProps) {
    const currentUserLoaded = this.props.auth.get('userLoaded')
    const nextUserLoaded = nextProps.auth.get('userLoaded')
    if (!currentUserLoaded && nextUserLoaded) {
      const isStaff = nextProps.auth.get('isStaff')
      if (!isStaff) {
        this.props.history.push({
          pathname: '/'
        })
      }
    }
  }

  render() {
    const { auth, children } = this.props
    // const username = auth.get('username')
    const userLoaded = auth.get('userLoaded')

    if (!userLoaded) {
      return <Spinner />
    }

    return (
      <div className="admin-layout">
        <div className="admin-menu">
          <div className="container-fluid py-2">
            Admin menu
          </div>
        </div>
        <div className="admin-content">
          <div className="container-fluid py-2">
            {children}
          </div>
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  getCurrentUser,
  signOut,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(AdminLayout)
