import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavItem, NavLink } from 'reactstrap'


const AppHeaderMenu = () => (
  <Nav className="ml-auto mr-3" navbar>
    <NavItem>
      <NavLink tag={Link} to="/">Auctions</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/">Mission</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/">FAQ</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/">The Good</NavLink>
    </NavItem>
  </Nav>
)

export default AppHeaderMenu
