import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Collapse, Navbar, NavbarToggler,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'

import AppHeaderMenu from 'components/AppHeaderMenu'
import AppLogo from 'components/AppLogo'
import IconUser from 'icons/IconUser'


const COMPONENT_CLASS = 'app-header'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const AccountDropdown = ({ className, isStaff, onSignOut }) => (
  <UncontrolledDropdown className={className}>
    <DropdownToggle tag="button" className={bem('account-toggler')}>
      <IconUser className="text-primary" />
    </DropdownToggle>
    <DropdownMenu right>
      {isStaff && <DropdownItem tag={Link} className="dropdown-item" to="/admin">Admin</DropdownItem>}
      <DropdownItem tag={Link} className="dropdown-item" to="/account">My Account</DropdownItem>
      <DropdownItem onClick={onSignOut}>Sign Out</DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
)

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
    const { isStaff } = this.props
    const { menuOpened } = this.state

    return (
      <Navbar color="faded" light expand="md" className={COMPONENT_CLASS}>
        <AppLogo />
        <div className={bem('account-responsive')} style={{ flexGrow: 1 }}>
          <AccountDropdown
            isStaff={isStaff}
            onSignOut={this.handleSignOut}
          />
        </div>
        <NavbarToggler onClick={this.handleToggleMenu} />
        <Collapse isOpen={menuOpened} navbar>
          <AppHeaderMenu />
          <AccountDropdown
            className="d-none d-md-block"
            isStaff={isStaff}
            onSignOut={this.handleSignOut}
          />
        </Collapse>
      </Navbar>
    )
  }
}

export default AppHeader
