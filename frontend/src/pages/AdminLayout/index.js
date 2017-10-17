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

  state = {
    menuOpened: false,
  }

  handleSignOut = () => {
    this.props.signOut()
  }

  handleOpenMenu = (e) => {
    e.preventDefault()
    this.setState({
      menuOpened: !this.state.menuOpened
    })
  }

  handleCloseMenu = () => {
    this.setState({
      menuOpened: false
    })
  }

  componentWillMount() {
    this.props.getCurrentUser()
  }

  render() {
    const { auth, children } = this.props
    // const username = auth.getIn(['currentUser', 'username'], '')
    const userLoaded = auth.get('userLoaded')

    if (!userLoaded) {
      return <Spinner />
    }

    const { menuOpened } = this.state

    const menuClasses = ['admin-menu']
    const menuBgClasses = ['menu-bg']
    if (menuOpened) {
      menuClasses.push('open')
      menuBgClasses.push('open')
    }

    return (
      <div className="admin-layout">
        <a className="menu-toggle" href="/" onClick={this.handleOpenMenu}>
          <i className="fa fa-bars"></i>
        </a>

        <div className={menuClasses.join(' ')}>
          <div className="container-fluid py-2">
            Admin menu
          </div>
        </div>
        <div className={menuBgClasses.join(' ')} onClick={this.handleCloseMenu} />

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
