import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { NavbarBrand } from 'reactstrap'


class AppLogo extends PureComponent {

  render() {
    return (
      <NavbarBrand tag={Link} to="/">
        <img src="/logo.svg" width="30" height="30" className="d-inline-block align-top mr-2" alt="Logo" />
        Charibin
      </NavbarBrand>
    )
  }
}

export default AppLogo
