import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './style.css'


class AppHeader extends PureComponent {

  static propTypes = {
    username: PropTypes.string.isRequired,
    onSignOut: PropTypes.func,
    isStaff: PropTypes.bool,
  }

  state = {
    accountMenuOpened: false
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
    const { accountMenuOpened } = this.state
    const accountMenuClasses = ['dropdown-menu', 'dropdown-menu-right', 'mx-3', 'my-1']

    if (accountMenuOpened) {
      accountMenuClasses.push('show')
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <span className="navbar-brand">Charibin</span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home</Link>
            </li>
          </ul>
          <a href="/" className="navbar-text" onClick={this.handleClickUsername}>
            Welcome, {username}!
          </a>
          <div className={accountMenuClasses.join(' ')}>
            {isStaff && <Link className="dropdown-item" to="/admin">Admin</Link>}
            <Link className="dropdown-item" to="/account-settings">Account Settings</Link>
            <a className="dropdown-item" href="/" onClick={this.handleSignOut}>Sign Out</a>
          </div>
          {accountMenuOpened && <div className="account-menu-bg" onClick={this.handleCloseAccountMenu} />}
        </div>
      </nav>
    )
  }
}

export default AppHeader
