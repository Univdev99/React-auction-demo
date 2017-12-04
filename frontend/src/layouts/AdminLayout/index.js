import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import AdminHeader from 'components/AdminHeader'
import Spinner from 'components/Spinner'
import {
  registerRealTimeNotificationHandler, unregisterRealTimeNotificationHandler
} from 'managers/RealTimeNotificationManager'
import { signOut } from 'store/modules/auth'
import { getNotificationListOnMenu, addNotification, resetNotificationUnreadCount } from 'store/modules/admin/notifications'
import { authSelector, adminNotificationsSelector } from 'store/selectors'
import userAvatarImage from 'images/avatar-placeholder.png'
import './style.css'


class AdminLayout extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    adminNotifications: ImmutablePropTypes.map.isRequired,
    history: PropTypes.object.isRequired,
    signOut: PropTypes.func,
    getNotificationListOnMenu: PropTypes.func,
    addNotification: PropTypes.func,
    resetNotificationUnreadCount: PropTypes.func,
  }

  state = {
    menuOpen: false,
  }

  handleSignOut = () => {
    this.props.signOut()
  }

  handleOpenMenu = (e) => {
    e.preventDefault()
    this.setState({
      menuOpen: !this.state.menuOpen
    })
  }

  handleCloseMenu = () => {
    this.setState({
      menuOpen: false
    })
  }

  handleNotification = (data) => {
    this.props.addNotification(data)
  }

  componentWillMount() {
    this.props.getNotificationListOnMenu()
  }

  componentDidMount() {
    registerRealTimeNotificationHandler(null, this.handleNotification)
  }

  componentWillUnmount() {
    unregisterRealTimeNotificationHandler(null, this.handleNotification)
  }

  render() {
    const { auth, adminNotifications, children, resetNotificationUnreadCount } = this.props
    const currentUser = auth.get('currentUser')
    const notificationListOnMenu = adminNotifications.get('notificationListOnMenu')
    const notificationListOnMenuLoaded = adminNotifications.get('notificationListOnMenuLoaded')
    const notificationUnreadCount = adminNotifications.get('notificationUnreadCount')

    if (!currentUser) {
      return <Spinner />
    }

    const { menuOpen } = this.state
    const username = currentUser.get('first_name') || currentUser.get('username')

    const menuClasses = ['admin-menu']
    const menuBgClasses = ['menu-bg']
    if (menuOpen) {
      menuClasses.push('open')
      menuBgClasses.push('open')
    }

    return (
      <div className="admin-layout">
        <a className="menu-toggle" href="/" onClick={this.handleOpenMenu}>
          <i className="fa fa-bars"></i>
        </a>

        <div className={menuClasses.join(' ')}>
          <div className="admin-header px-2 text-center">
            <img className="logo" src="/logo.svg" alt="Logo" />
          </div>
          <div className="container-fluid py-2">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/auctions">Auctions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/donors">Donors</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/charities">Charities</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/sales">Sales</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/posts">Blog</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/media">Media</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/admin/backlog">Backlog</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={menuBgClasses.join(' ')} onClick={this.handleCloseMenu} />

        <div className="admin-content">
          <AdminHeader
            username={username}
            userAvatarImage={userAvatarImage}
            notificationListOnMenu={notificationListOnMenu}
            notificationListOnMenuLoaded={notificationListOnMenuLoaded}
            notificationUnreadCount={notificationUnreadCount}
            onSignOut={this.handleSignOut}
            resetNotificationUnreadCount={resetNotificationUnreadCount}
          />

          <div className="container-fluid p-4" style={{ maxWidth: 1200, marginLeft: 0 }}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
  adminNotifications: adminNotificationsSelector,
})

const actions = {
  signOut,
  getNotificationListOnMenu,
  addNotification,
  resetNotificationUnreadCount,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(AdminLayout)
