import React, { PureComponent } from 'react'
import FaFacebook from 'react-icons/lib/fa/facebook'
import FaLinkedin from 'react-icons/lib/fa/linkedin'
import FaTwitter from 'react-icons/lib/fa/twitter'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

import AppLogo from 'components/AppLogo'


const COMPONENT_CLASS = 'app-footer'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const SocialLink = ({ type, ...props }) => (
  <NavLink className={`social-icon social-icon--${type}`} {...props} />
)

class AppFooter extends PureComponent {
  render() {

    return (
      <Navbar color="dark" dark expand="lg" className={COMPONENT_CLASS}>
        <AppLogo color="grey" className={bem('logo')} />
        <div className={bem('navs')}>
          <Nav className={bem('nav')} navbar>
            <NavItem>
              <NavLink tag={Link} to="/privacy-policy">Privacy Policy</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/terms-conditions">Terms & Conditions</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/shipping">Shipping</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/support">Support</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/careers">Careers</NavLink>
            </NavItem>
          </Nav>
          <Nav className={bem('social')}>
            <NavItem>
              <SocialLink href="https://facebook.com/" type="facebook"><FaFacebook /></SocialLink>
            </NavItem>
            <NavItem>
              <SocialLink href="https://twitter.com/" type="twitter"><FaTwitter /></SocialLink>
            </NavItem>
            <NavItem>
              <SocialLink href="https://linkedin.com/" type="linkedin"><FaLinkedin /></SocialLink>
            </NavItem>
          </Nav>
        </div>
      </Navbar>
    )
  }
}

export default AppFooter
