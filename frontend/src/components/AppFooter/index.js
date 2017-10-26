import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'

import AppLogo from 'components/AppLogo'


class AppFooter extends PureComponent {

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
          <Nav className="ml-auto mr-3" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">Privacy Policy</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/">Terms & Conditions</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/">Shipping</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/">Support</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/">Careers</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        <Nav className="d-none d-md-flex" navbar>
          <NavItem>
            <a className="nav-link" href="/"><i className="fa fa-facebook-square" /></a>
          </NavItem>
          <NavItem>
            <a className="nav-link" href="/"><i className="fa fa-twitter-square" /></a>
          </NavItem>
          <NavItem>
            <a className="nav-link" href="/"><i className="fa fa-linkedin-square" /></a>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default AppFooter
