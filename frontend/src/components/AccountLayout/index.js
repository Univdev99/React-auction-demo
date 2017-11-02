import React from 'react'
import { Col, Nav, NavLink, NavItem, Row } from 'reactstrap'
import { NavLink as RouterNavLink } from 'react-router-dom'

import AppContainerLayout from 'components/AppContainerLayout'
import AppLayout1 from 'pages/AppLayout1'


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

const AccountLayout = ({ children }) => (
  <AppLayout1>
    <AppContainerLayout>
      <Row>
        <Col xs={12} md={4} className="mb-5">
          <Nav vertical>
            {navs.map((item, index) => (
              <NavItem key={index}>
                <NavLink tag={RouterNavLink} to={`/account/${item.slug}`}
                  activeClassName="text-secondary"
                >
                  {item.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Col>
        <Col xs={12} md={8}>
          {children}
        </Col>
      </Row>
    </AppContainerLayout>
  </AppLayout1>
)

export default AccountLayout
