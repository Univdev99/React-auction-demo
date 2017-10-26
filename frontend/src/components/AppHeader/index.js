import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap'

import AppHeaderMenu from 'components/AppHeaderMenu'
import AppLogo from 'components/AppLogo'
import './style.css'


class AppHeader extends PureComponent {

  static propTypes = {
    username: PropTypes.string.isRequired,
    onSignOut: PropTypes.func,
    isStaff: PropTypes.bool,
  }

  state = {
    menuOpened: false,
    accountMenuOpened: false
  }

  handleToggleMenu = () => {
    this.setState({
      menuOpened: !this.state.menuOpened
    })
  }

  handleClickUsername = (e) => {
    e.preventDefault()
    this.setState({
      accountMenuOpened: !this.state.accountMenuOpened
    })
  }

  handleCloseAccountMenu = () => {
    this.setState({
      accountMenuOpened: false
    })
  }

  handleSignOut = (e) => {
    e.preventDefault()

    const { onSignOut } = this.props
    if (onSignOut) {
      onSignOut()
    }
  }

  render() {
    const { username, isStaff } = this.props
    const { menuOpened, accountMenuOpened } = this.state
    const accountMenuClasses = ['dropdown-menu', 'dropdown-menu-right', 'mx-3', 'my-1']

    if (accountMenuOpened) {
      accountMenuClasses.push('show')
    }

    return (
      <Navbar color="dark" dark expand="md">
        <AppLogo />
        <NavbarToggler onClick={this.handleToggleMenu} />
        <Collapse isOpen={menuOpened} navbar>
          <AppHeaderMenu />

          <a href="/" className="navbar-text" onClick={this.handleClickUsername}>
            <span className="mr-2"><i className="fa fa-user-circle" /></span>
            {username}
          </a>
          <div className={accountMenuClasses.join(' ')}>
            {isStaff && <Link className="dropdown-item" to="/admin">Admin</Link>}
            <Link className="dropdown-item" to="/account-settings">Account Settings</Link>
            <a className="dropdown-item" href="/" onClick={this.handleSignOut}>Sign Out</a>
          </div>
          {accountMenuOpened && <div className="account-menu-bg" onClick={this.handleCloseAccountMenu} />}
        </Collapse>
      </Navbar>
    )
  }
}

export default AppHeader
