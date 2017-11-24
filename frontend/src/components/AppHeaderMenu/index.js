import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavItem, NavLink } from 'reactstrap'


const AppHeaderMenu = () => (
  <Nav className="ml-auto mr-3" navbar>
    <NavItem>
      <NavLink tag={Link} to="/auctions">Auctions</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/mission">Mission</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/faqs">FAQ</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/blog">The Good</NavLink>
    </NavItem>
  </Nav>
)

export default AppHeaderMenu
