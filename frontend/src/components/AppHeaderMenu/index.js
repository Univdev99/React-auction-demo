import React from 'react'
import cx from 'classnames'
import { NavLink as Link } from 'react-router-dom'
import { Nav, NavItem as BsNavItem, NavLink } from 'reactstrap'

const COMPONENT_CLASS = 'app-header-menu'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const NavItem = ({ children }) => (
  <BsNavItem className={bem('item')}>
    {children}
  </BsNavItem>
)

const AppHeaderMenu = () => (
  <Nav className={cx(COMPONENT_CLASS, 'ml-auto mr-3')} navbar>
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
