import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Collapse, Navbar, NavbarToggler,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'

import AppHeaderMenu from 'components/AppHeaderMenu'
import AppLogo from 'components/AppLogo'


class AppHeader extends PureComponent {

  static propTypes = {
    username: PropTypes.string.isRequired,
    onSignOut: PropTypes.func,
    isStaff: PropTypes.bool,
  }

  state = {
    menuOpened: false,
  }

  handleToggleMenu = () => {
    this.setState({
      menuOpened: !this.state.menuOpened
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
    const { menuOpened } = this.state

    return (
      <Navbar color="dark" dark expand="md">
        <AppLogo />
        <NavbarToggler onClick={this.handleToggleMenu} />
        <Collapse isOpen={menuOpened} navbar>
          <AppHeaderMenu />

          <UncontrolledDropdown>
            <DropdownToggle tag="span" className="navbar-link cursor-pointer mr-2 text-muted">
              <i className="fa fa-user-circle" />
            </DropdownToggle>
            <DropdownMenu right>
              {isStaff && <DropdownItem tag={Link} className="dropdown-item" to="/admin">Admin</DropdownItem>}
              <DropdownItem tag={Link} className="dropdown-item" to="/account">My Account</DropdownItem>
              <DropdownItem onClick={this.handleSignOut}>Sign Out</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Collapse>
      </Navbar>
    )
  }
}

export default AppHeader
