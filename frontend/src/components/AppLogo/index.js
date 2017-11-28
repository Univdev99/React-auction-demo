import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { NavbarBrand } from 'reactstrap'


class AppLogo extends PureComponent {

  render() {
    return (
      <NavbarBrand tag={Link} to="/">
        <img src="/logo.svg" height="48" className="align-top" alt="yuma" />
      </NavbarBrand>
    )
  }
}

export default AppLogo
