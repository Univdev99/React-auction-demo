import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap'

import AppHeaderMenu from 'components/AppHeaderMenu'
import AppLogo from 'components/AppLogo'


class AppHeaderGuest extends PureComponent {

  state = {
    menuOpened: false
  }

  handleToggleMenu = () => {
    this.setState({
      menuOpened: !this.state.menuOpened
    })
  }

  render() {
    const { menuOpened } = this.state

    return (
      <Navbar color="dark" dark expand="md">
        <AppLogo />
        <NavbarToggler onClick={this.handleToggleMenu} />
        <Collapse isOpen={menuOpened} navbar>
          <AppHeaderMenu />

          <Link className="navbar-text ml-3" to="/signin">
            <i className="fa fa-user-circle" />
          </Link>
        </Collapse>
      </Navbar>
    )
  }
}

export default AppHeaderGuest
