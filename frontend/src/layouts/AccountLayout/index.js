import React from 'react'
import { Col, Nav, NavLink, NavItem, Row } from 'reactstrap'
import { NavLink as RouterNavLink } from 'react-router-dom'

import AppContainerLayout from '../AppContainerLayout'
import AppLayout1 from '../AppLayout1'


const navs = [
  {
    name: 'Bids',
    slug: 'bids'
  },
  {
    name: 'Wins',
    slug: 'wins'
  },
  {
    name: 'Account Info',
    slug: 'info'
  },
  {
    name: 'Payment Info',
    slug: 'payment-info'
  },
  {
    name: 'Change Password',
    slug: 'change-password'
  }
]


const COMPONENT_CLASS = 'account-layout'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const AccountLayout = ({ children }) => (
  <AppLayout1>
    <AppContainerLayout>
      <Row>
        <Col xs={12} lg={4}>
          <Nav vertical className={bem('nav')}>
            {navs.map((item, index) => (
              <NavItem key={index} className={bem('nav-item')}>
                <NavLink
                  tag={RouterNavLink}
                  to={`/account/${item.slug}`}
                  className={bem('nav-link')}
                >
                  {item.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Col>
        <Col xs={12} lg={8}>
          {children}
        </Col>
      </Row>
    </AppContainerLayout>
  </AppLayout1>
)

export default AccountLayout
