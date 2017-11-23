import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import Spinner from 'components/Spinner'
import { signOut } from 'store/modules/auth'
import { authSelector } from 'store/selectors'
import userAvatarImage from 'images/avatar-placeholder.png'
import './style.css'


class AdminLayout extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    history: PropTypes.object.isRequired,
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

  render() {
    const { auth, children } = this.props
    const currentUser = auth.get('currentUser')

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
                <Link className="nav-link" to="/admin/donors">Donors</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/charities">Charities</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/auctions">Auctions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/sales">Sales</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/posts">Blog</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/media">Media</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/backlog">Backlog</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={menuBgClasses.join(' ')} onClick={this.handleCloseMenu} />

        <div className="admin-content">
          <div className="admin-header shadow">
            <div className="px-4 content text-right">
              <UncontrolledDropdown className="mr-3" style={{ display: 'inline-block' }}>
                <DropdownToggle
                  tag="a"
                  className="p-2 text-muted"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa fa-bell" />
                </DropdownToggle>
                <DropdownMenu right style={{ left: 'auto' }}>
                  <DropdownItem>Notification 1</DropdownItem>
                  <DropdownItem>Notification 2</DropdownItem>
                  <DropdownItem>Notification 3</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown style={{ display: 'inline-block' }}>
                <DropdownToggle
                  tag="a"
                  className="text-muted"
                  style={{ display: 'inline-block', cursor: 'pointer' }}
                >
                  <img className="user-avatar mr-3" src={userAvatarImage} alt="User Avatar" />
                  {username}
                  <i className="ml-2 fa fa-angle-down" />
                </DropdownToggle>
                <DropdownMenu right style={{ width: 200 }}>
                  <DropdownItem tag={Link} to="/">View Site</DropdownItem>
                  <DropdownItem tag={Link} to="/account">Account Settings</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.handleSignOut}>Sign Out</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>

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
})

const actions = {
  signOut,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(AdminLayout)
